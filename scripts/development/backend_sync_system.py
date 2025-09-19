# Automated Sync System for Autopilot Marketing Platform
# This module provides scheduling and execution of data sync jobs

from fastapi import HTTPException
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Any
import asyncio
import json
import uuid
from enum import Enum
from pydantic import BaseModel

class SyncType(str, Enum):
    CAMPAIGNS = "campaigns"
    PERFORMANCE = "performance"
    BOTH = "both"

class SyncFrequency(str, Enum):
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    MANUAL = "manual"

class SyncStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    ERROR = "error"
    RUNNING = "running"

class JobStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"
    PARTIAL = "partial"
    RUNNING = "running"

# Pydantic Models
class SyncScheduleCreate(BaseModel):
    name: str
    type: SyncType
    frequency: SyncFrequency
    enabled: bool = True
    next_run: Optional[datetime] = None

class SyncScheduleUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[SyncType] = None
    frequency: Optional[SyncFrequency] = None
    enabled: Optional[bool] = None
    next_run: Optional[datetime] = None

class SyncScheduleOut(BaseModel):
    id: str
    name: str
    type: SyncType
    frequency: SyncFrequency
    next_run: datetime
    last_run: Optional[datetime]
    status: SyncStatus
    enabled: bool
    created_at: datetime
    updated_at: datetime

class SyncJobOut(BaseModel):
    id: str
    schedule_id: str
    schedule_name: str
    type: SyncType
    status: JobStatus
    started_at: datetime
    completed_at: Optional[datetime]
    items_synced: int
    errors: List[str]
    duration: Optional[float]  # in seconds

class SyncMetrics(BaseModel):
    total_jobs: int
    successful_jobs: int
    failed_jobs: int
    avg_sync_time: float
    last_sync_time: Optional[datetime]
    data_points_synced: int

class SystemStatus(BaseModel):
    id: str
    name: str
    type: str  # api, database, sync, analytics
    status: str  # online, offline, warning, error
    last_sync: Optional[datetime]
    next_sync: Optional[datetime]
    response_time: Optional[int]  # milliseconds
    uptime: Optional[float]  # percentage
    error_count: int

# In-memory storage for demonstration (in production, use database)
sync_schedules: Dict[str, Dict] = {}
sync_jobs: Dict[str, Dict] = {}
system_statuses: Dict[str, Dict] = {}

def _iso(dt: datetime) -> str:
    """Convert datetime to ISO string"""
    return dt.isoformat()

def _now() -> datetime:
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)

def calculate_next_run(frequency: SyncFrequency, from_time: Optional[datetime] = None) -> datetime:
    """Calculate next run time based on frequency"""
    base_time = from_time or _now()
    
    if frequency == SyncFrequency.HOURLY:
        return base_time + timedelta(hours=1)
    elif frequency == SyncFrequency.DAILY:
        return base_time + timedelta(days=1)
    elif frequency == SyncFrequency.WEEKLY:
        return base_time + timedelta(weeks=1)
    else:  # manual
        return base_time + timedelta(days=365)  # Far future for manual schedules

def initialize_default_schedules():
    """Initialize default sync schedules"""
    default_schedules = [
        {
            "id": "campaign-daily",
            "name": "Daily Campaign Sync",
            "type": SyncType.CAMPAIGNS,
            "frequency": SyncFrequency.DAILY,
            "enabled": True,
            "status": SyncStatus.ACTIVE,
            "created_at": _now(),
            "updated_at": _now()
        },
        {
            "id": "performance-hourly",
            "name": "Hourly Performance Update",
            "type": SyncType.PERFORMANCE,
            "frequency": SyncFrequency.HOURLY,
            "enabled": True,
            "status": SyncStatus.ACTIVE,
            "created_at": _now(),
            "updated_at": _now()
        },
        {
            "id": "complete-weekly",
            "name": "Weekly Complete Sync",
            "type": SyncType.BOTH,
            "frequency": SyncFrequency.WEEKLY,
            "enabled": False,
            "status": SyncStatus.PAUSED,
            "created_at": _now(),
            "updated_at": _now()
        }
    ]
    
    for schedule in default_schedules:
        schedule["next_run"] = calculate_next_run(schedule["frequency"])
        schedule["last_run"] = _now() - timedelta(hours=2)  # Simulate previous run
        sync_schedules[schedule["id"]] = schedule

def initialize_system_statuses():
    """Initialize system status monitoring"""
    systems = [
        {
            "id": "google-ads-api",
            "name": "Google Ads API",
            "type": "api",
            "status": "online",
            "response_time": 245,
            "uptime": 99.8,
            "error_count": 0
        },
        {
            "id": "supabase-db",
            "name": "Supabase Database",
            "type": "database",
            "status": "online",
            "response_time": 89,
            "uptime": 99.9,
            "error_count": 0
        },
        {
            "id": "campaign-sync",
            "name": "Campaign Data Sync",
            "type": "sync",
            "status": "online",
            "response_time": 1234,
            "uptime": 98.5,
            "error_count": 2
        },
        {
            "id": "performance-sync",
            "name": "Performance Analytics",
            "type": "analytics",
            "status": "warning",
            "response_time": 3456,
            "uptime": 95.2,
            "error_count": 8
        }
    ]
    
    for system in systems:
        system["last_sync"] = _now() - timedelta(minutes=30)
        system["next_sync"] = _now() + timedelta(hours=1)
        system_statuses[system["id"]] = system

# Sync execution simulation
async def execute_sync_job(schedule_id: str, manual: bool = False) -> Dict:
    """Execute a sync job (simulated)"""
    if schedule_id not in sync_schedules:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    schedule = sync_schedules[schedule_id]
    job_id = str(uuid.uuid4())
    
    # Create job record
    job = {
        "id": job_id,
        "schedule_id": schedule_id,
        "schedule_name": schedule["name"],
        "type": schedule["type"],
        "status": JobStatus.RUNNING,
        "started_at": _now(),
        "completed_at": None,
        "items_synced": 0,
        "errors": [],
        "duration": None
    }
    
    sync_jobs[job_id] = job
    
    # Update schedule status
    sync_schedules[schedule_id]["status"] = SyncStatus.RUNNING
    
    try:
        # Simulate sync work
        await asyncio.sleep(2)  # Simulate processing time
        
        # Simulate results
        items_synced = 15 if schedule["type"] == SyncType.CAMPAIGNS else 8
        if schedule["type"] == SyncType.BOTH:
            items_synced = 23
        
        # Simulate occasional errors
        errors = []
        if schedule["type"] == SyncType.PERFORMANCE and len(sync_jobs) % 5 == 0:
            errors.append("API rate limit exceeded for 2 requests")
            items_synced -= 2
        
        # Complete job
        completed_at = _now()
        duration = (completed_at - job["started_at"]).total_seconds()
        
        job.update({
            "status": JobStatus.PARTIAL if errors else JobStatus.SUCCESS,
            "completed_at": completed_at,
            "items_synced": items_synced,
            "errors": errors,
            "duration": duration
        })
        
        # Update schedule
        schedule.update({
            "status": SyncStatus.ACTIVE if schedule["enabled"] else SyncStatus.PAUSED,
            "last_run": completed_at,
            "next_run": calculate_next_run(schedule["frequency"], completed_at) if not manual else schedule["next_run"],
            "updated_at": completed_at
        })
        
        return job
        
    except Exception as e:
        # Handle job failure
        completed_at = _now()
        duration = (completed_at - job["started_at"]).total_seconds()
        
        job.update({
            "status": JobStatus.FAILED,
            "completed_at": completed_at,
            "errors": [str(e)],
            "duration": duration
        })
        
        schedule.update({
            "status": SyncStatus.ERROR,
            "updated_at": completed_at
        })
        
        return job

# API Endpoints to add to main.py

def get_sync_schedules() -> List[Dict]:
    """Get all sync schedules"""
    return list(sync_schedules.values())

def create_sync_schedule(schedule_data: SyncScheduleCreate) -> Dict:
    """Create a new sync schedule"""
    schedule_id = str(uuid.uuid4())
    now = _now()
    
    schedule = {
        "id": schedule_id,
        "name": schedule_data.name,
        "type": schedule_data.type,
        "frequency": schedule_data.frequency,
        "enabled": schedule_data.enabled,
        "status": SyncStatus.ACTIVE if schedule_data.enabled else SyncStatus.PAUSED,
        "next_run": schedule_data.next_run or calculate_next_run(schedule_data.frequency),
        "last_run": None,
        "created_at": now,
        "updated_at": now
    }
    
    sync_schedules[schedule_id] = schedule
    return schedule

def update_sync_schedule(schedule_id: str, update_data: SyncScheduleUpdate) -> Dict:
    """Update a sync schedule"""
    if schedule_id not in sync_schedules:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    schedule = sync_schedules[schedule_id]
    update_dict = update_data.dict(exclude_unset=True)
    
    if "enabled" in update_dict:
        update_dict["status"] = SyncStatus.ACTIVE if update_dict["enabled"] else SyncStatus.PAUSED
    
    if "frequency" in update_dict and update_dict["frequency"] != schedule["frequency"]:
        update_dict["next_run"] = calculate_next_run(update_dict["frequency"])
    
    update_dict["updated_at"] = _now()
    schedule.update(update_dict)
    
    return schedule

def delete_sync_schedule(schedule_id: str) -> Dict:
    """Delete a sync schedule"""
    if schedule_id not in sync_schedules:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    schedule = sync_schedules.pop(schedule_id)
    return {"message": "Schedule deleted successfully", "schedule": schedule}

async def trigger_sync_job(schedule_id: str) -> Dict:
    """Manually trigger a sync job"""
    return await execute_sync_job(schedule_id, manual=True)

def get_sync_jobs(limit: int = 50) -> List[Dict]:
    """Get sync job history"""
    jobs = list(sync_jobs.values())
    jobs.sort(key=lambda x: x["started_at"], reverse=True)
    return jobs[:limit]

def get_sync_metrics() -> Dict:
    """Get sync metrics summary"""
    jobs = list(sync_jobs.values())
    completed_jobs = [j for j in jobs if j["status"] in [JobStatus.SUCCESS, JobStatus.FAILED, JobStatus.PARTIAL]]
    successful_jobs = [j for j in jobs if j["status"] == JobStatus.SUCCESS]
    
    avg_sync_time = 0
    if completed_jobs:
        total_time = sum(j.get("duration", 0) for j in completed_jobs if j.get("duration"))
        avg_sync_time = total_time / len(completed_jobs) if completed_jobs else 0
    
    last_sync = None
    if completed_jobs:
        last_sync = max(j["completed_at"] for j in completed_jobs if j.get("completed_at"))
    
    total_items = sum(j.get("items_synced", 0) for j in completed_jobs)
    
    return {
        "total_jobs": len(jobs),
        "successful_jobs": len(successful_jobs),
        "failed_jobs": len([j for j in jobs if j["status"] == JobStatus.FAILED]),
        "avg_sync_time": round(avg_sync_time, 2),
        "last_sync_time": last_sync,
        "data_points_synced": total_items
    }

def get_system_statuses() -> List[Dict]:
    """Get system status information"""
    return list(system_statuses.values())

def update_system_status(system_id: str, status_data: Dict) -> Dict:
    """Update system status"""
    if system_id not in system_statuses:
        raise HTTPException(status_code=404, detail="System not found")
    
    system = system_statuses[system_id]
    system.update(status_data)
    return system

# Initialize default data
initialize_default_schedules()
initialize_system_statuses()

# FastAPI endpoint definitions to add to main.py:
"""
@app.get("/sync/schedules")
def api_get_sync_schedules():
    return get_sync_schedules()

@app.post("/sync/schedules")
def api_create_sync_schedule(schedule: SyncScheduleCreate):
    return create_sync_schedule(schedule)

@app.put("/sync/schedules/{schedule_id}")
def api_update_sync_schedule(schedule_id: str, schedule: SyncScheduleUpdate):
    return update_sync_schedule(schedule_id, schedule)

@app.delete("/sync/schedules/{schedule_id}")
def api_delete_sync_schedule(schedule_id: str):
    return delete_sync_schedule(schedule_id)

@app.post("/sync/schedules/{schedule_id}/trigger")
async def api_trigger_sync_job(schedule_id: str):
    return await trigger_sync_job(schedule_id)

@app.get("/sync/jobs")
def api_get_sync_jobs(limit: int = 50):
    return get_sync_jobs(limit)

@app.get("/sync/metrics")
def api_get_sync_metrics():
    return get_sync_metrics()

@app.get("/sync/system-status")
def api_get_system_statuses():
    return get_system_statuses()

@app.put("/sync/system-status/{system_id}")
def api_update_system_status(system_id: str, status_data: dict):
    return update_system_status(system_id, status_data)
"""