"""
Automation Rules API Endpoints for PulseBridge.ai
Add these endpoints to your FastAPI main.py
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json

# Add these Pydantic models after existing models

class AutomationRuleIn(BaseModel):
    name: str
    description: Optional[str] = None
    campaign_id: Optional[str] = None  # None for global rules
    rule_type: str  # 'budget_optimization', 'performance_trigger', 'auto_pause', 'bid_adjustment'
    conditions: dict  # JSON conditions
    actions: dict  # JSON actions
    is_active: Optional[bool] = True
    priority: Optional[int] = 1

class AutomationRuleOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    campaign_id: Optional[str]
    rule_type: str
    conditions: dict
    actions: dict
    is_active: bool
    priority: int
    last_triggered: Optional[datetime]
    trigger_count: int
    created_at: datetime
    updated_at: datetime

class AutomationLogOut(BaseModel):
    id: str
    rule_id: str
    campaign_id: str
    action_taken: str
    conditions_met: dict
    results: dict
    success: bool
    error_message: Optional[str]
    triggered_at: datetime

class AutomationExecutionResult(BaseModel):
    rules_evaluated: int
    actions_taken: int
    campaigns_affected: List[str]
    logs: List[Dict[str, Any]]

# Add these endpoints after existing endpoints

@app.get("/automation/rules", response_model=List[AutomationRuleOut])
def get_automation_rules(
    campaign_id: Optional[str] = None,
    rule_type: Optional[str] = None,
    is_active: Optional[bool] = None,
    limit: int = 100
):
    """Get automation rules with optional filtering"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    query = supabase.table("automation_rules").select("*")
    
    if campaign_id:
        query = query.eq("campaign_id", campaign_id)
    if rule_type:
        query = query.eq("rule_type", rule_type)
    if is_active is not None:
        query = query.eq("is_active", is_active)
    
    res = query.order("priority", desc=True).order("created_at", desc=True).limit(limit).execute()
    return res.data or []

@app.post("/automation/rules", response_model=AutomationRuleOut)
def create_automation_rule(rule: AutomationRuleIn):
    """Create a new automation rule"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    payload = rule.dict()
    res = supabase.table("automation_rules").insert(payload).execute()
    
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create automation rule")
    
    return res.data[0]

@app.get("/automation/rules/{rule_id}", response_model=AutomationRuleOut)
def get_automation_rule(rule_id: str):
    """Get a specific automation rule"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    res = supabase.table("automation_rules").select("*").eq("id", rule_id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    
    return res.data[0]

@app.put("/automation/rules/{rule_id}", response_model=AutomationRuleOut)
def update_automation_rule(rule_id: str, rule: AutomationRuleIn):
    """Update an automation rule"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    payload = rule.dict()
    payload["updated_at"] = _iso(datetime.now(timezone.utc))
    
    res = supabase.table("automation_rules").update(payload).eq("id", rule_id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    
    return res.data[0]

@app.delete("/automation/rules/{rule_id}")
def delete_automation_rule(rule_id: str):
    """Delete an automation rule"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    res = supabase.table("automation_rules").delete().eq("id", rule_id).execute()
    return {"success": True}

@app.post("/automation/rules/{rule_id}/toggle")
def toggle_automation_rule(rule_id: str):
    """Toggle automation rule active status"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    # Get current status
    rule_res = supabase.table("automation_rules").select("is_active").eq("id", rule_id).execute()
    
    if not rule_res.data:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    
    current_status = rule_res.data[0]["is_active"]
    new_status = not current_status
    
    # Update status
    res = supabase.table("automation_rules").update({
        "is_active": new_status,
        "updated_at": _iso(datetime.now(timezone.utc))
    }).eq("id", rule_id).execute()
    
    return {"success": True, "is_active": new_status}

@app.get("/automation/logs", response_model=List[AutomationLogOut])
def get_automation_logs(
    campaign_id: Optional[str] = None,
    rule_id: Optional[str] = None,
    days: int = 7,
    limit: int = 100
):
    """Get automation execution logs"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    start_date = (_today_utc() - timedelta(days=days)).isoformat()
    
    query = supabase.table("automation_logs").select("*")
    
    if campaign_id:
        query = query.eq("campaign_id", campaign_id)
    if rule_id:
        query = query.eq("rule_id", rule_id)
    
    res = query.gte("triggered_at", start_date).order("triggered_at", desc=True).limit(limit).execute()
    return res.data or []

@app.post("/automation/execute", response_model=AutomationExecutionResult)
def execute_automation_rules(campaign_id: Optional[str] = None):
    """Execute automation rules (manual trigger or scheduled)"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    # Get active automation rules
    rules_query = supabase.table("automation_rules").select("*").eq("is_active", True)
    
    if campaign_id:
        # Rules for specific campaign + global rules (campaign_id is null)
        rules_query = rules_query.or_(f"campaign_id.eq.{campaign_id},campaign_id.is.null")
    
    rules_res = rules_query.order("priority", desc=True).execute()
    rules = rules_res.data or []
    
    # Get campaigns to evaluate
    campaigns_query = supabase.table("campaigns").select("*").eq("status", "active")
    if campaign_id:
        campaigns_query = campaigns_query.eq("id", campaign_id)
    
    campaigns_res = campaigns_query.execute()
    campaigns = campaigns_res.data or []
    
    execution_result = {
        "rules_evaluated": len(rules),
        "actions_taken": 0,
        "campaigns_affected": [],
        "logs": []
    }
    
    # Execute rules for each campaign
    for campaign in campaigns:
        for rule in rules:
            # Skip campaign-specific rules that don't match
            if rule.get("campaign_id") and rule["campaign_id"] != campaign["id"]:
                continue
            
            # Evaluate rule conditions
            should_trigger = _evaluate_rule_conditions(campaign, rule["conditions"])
            
            if should_trigger:
                # Execute rule actions
                action_result = _execute_rule_actions(campaign, rule["actions"])
                
                # Log the action
                log_entry = {
                    "rule_id": rule["id"],
                    "campaign_id": campaign["id"],
                    "action_taken": action_result["action"],
                    "conditions_met": rule["conditions"],
                    "results": action_result["results"],
                    "success": action_result["success"],
                    "error_message": action_result.get("error")
                }
                
                supabase.table("automation_logs").insert(log_entry).execute()
                
                # Update rule trigger count
                supabase.table("automation_rules").update({
                    "last_triggered": _iso(datetime.now(timezone.utc)),
                    "trigger_count": rule["trigger_count"] + 1
                }).eq("id", rule["id"]).execute()
                
                execution_result["actions_taken"] += 1
                if campaign["id"] not in execution_result["campaigns_affected"]:
                    execution_result["campaigns_affected"].append(campaign["id"])
                
                execution_result["logs"].append(log_entry)
    
    return execution_result

def _evaluate_rule_conditions(campaign: dict, conditions: dict) -> bool:
    """Evaluate if rule conditions are met for a campaign"""
    # This is a simplified version - you'd expand this with real logic
    
    # Get latest performance data
    perf_res = supabase.table("performance_snapshots").select("*").eq(
        "campaign_id", campaign["id"]
    ).order("date", desc=True).limit(7).execute()
    
    recent_performance = perf_res.data or []
    
    if not recent_performance:
        return False
    
    latest_perf = recent_performance[0]
    
    # Example condition evaluations
    if conditions.get("ctr_threshold"):
        if latest_perf.get("ctr", 0) < conditions["ctr_threshold"]:
            if latest_perf.get("impressions", 0) >= conditions.get("min_impressions", 1000):
                return True
    
    if conditions.get("spend_threshold_percentage"):
        campaign_budget = campaign.get("budget", 0)
        if campaign_budget > 0:
            spend_percentage = latest_perf.get("spend", 0) / campaign_budget
            if spend_percentage >= conditions["spend_threshold_percentage"]:
                return True
    
    if conditions.get("min_clicks") and conditions.get("max_conversions") is not None:
        total_clicks = sum(p.get("clicks", 0) for p in recent_performance[:7])
        total_conversions = sum(p.get("conversions", 0) for p in recent_performance[:7])
        
        if total_clicks >= conditions["min_clicks"] and total_conversions <= conditions["max_conversions"]:
            return True
    
    return False

def _execute_rule_actions(campaign: dict, actions: dict) -> dict:
    """Execute the actions specified in a rule"""
    result = {
        "action": actions.get("action", "unknown"),
        "success": True,
        "results": {},
        "error": None
    }
    
    try:
        action_type = actions.get("action")
        
        if action_type == "pause_campaign":
            # Update campaign status to paused
            supabase.table("campaigns").update({
                "status": "paused",
                "updated_at": _iso(datetime.now(timezone.utc))
            }).eq("id", campaign["id"]).execute()
            
            result["results"]["previous_status"] = campaign.get("status")
            result["results"]["new_status"] = "paused"
        
        elif action_type == "increase_bid":
            # This would integrate with actual ad platform APIs
            adjustment = actions.get("adjustment_percentage", 0.15)
            current_bid = campaign.get("metrics", {}).get("max_cpc", 1.0)
            new_bid = current_bid * (1 + adjustment)
            max_bid = actions.get("max_bid_limit", 10.0)
            
            new_bid = min(new_bid, max_bid)
            
            # Update campaign metrics (in real implementation, this would call Google Ads API)
            updated_metrics = campaign.get("metrics", {})
            updated_metrics["max_cpc"] = new_bid
            
            supabase.table("campaigns").update({
                "metrics": updated_metrics,
                "updated_at": _iso(datetime.now(timezone.utc))
            }).eq("id", campaign["id"]).execute()
            
            result["results"]["previous_bid"] = current_bid
            result["results"]["new_bid"] = new_bid
        
        # Add more action types as needed
        
    except Exception as e:
        result["success"] = False
        result["error"] = str(e)
    
    return result

@app.get("/automation/dashboard")
def get_automation_dashboard():
    """Get automation dashboard overview"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    # Get rule counts by type and status
    rules_res = supabase.table("automation_rules").select("rule_type, is_active", count="exact").execute()
    
    # Get recent automation activity (last 24 hours)
    yesterday = (_today_utc() - timedelta(days=1)).isoformat()
    logs_res = supabase.table("automation_logs").select("success", count="exact").gte("triggered_at", yesterday).execute()
    
    recent_logs = supabase.table("automation_logs").select("*").gte("triggered_at", yesterday).order("triggered_at", desc=True).limit(10).execute()
    
    # Calculate success rate
    total_logs = len(logs_res.data or [])
    successful_logs = len([log for log in (logs_res.data or []) if log.get("success")])
    success_rate = (successful_logs / total_logs * 100) if total_logs > 0 else 100
    
    return {
        "total_rules": len(rules_res.data or []),
        "active_rules": len([r for r in (rules_res.data or []) if r.get("is_active")]),
        "recent_executions_24h": total_logs,
        "success_rate_24h": success_rate,
        "recent_activity": recent_logs.data or []
    }