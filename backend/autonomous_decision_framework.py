"""
Autonomous Decision Framework for PulseBridge.ai
Provides intelligent decision-making system with safety guardrails and autonomous campaign management
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Union, Any
from dataclasses import dataclass, asdict
from enum import Enum
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DecisionType(Enum):
    """Types of autonomous decisions"""
    BUDGET_ADJUSTMENT = "budget_adjustment"
    BID_OPTIMIZATION = "bid_optimization"
    CAMPAIGN_PAUSE = "campaign_pause"
    CAMPAIGN_RESUME = "campaign_resume"
    TARGETING_ADJUSTMENT = "targeting_adjustment"
    CREATIVE_OPTIMIZATION = "creative_optimization"
    PLATFORM_REALLOCATION = "platform_reallocation"
    EMERGENCY_STOP = "emergency_stop"

class RiskLevel(Enum):
    """Risk levels for decisions"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ApprovalStatus(Enum):
    """Approval status for decisions"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    AUTO_APPROVED = "auto_approved"
    EXECUTED = "executed"

@dataclass
class SafetyGuardrail:
    """Safety guardrail definition"""
    name: str
    description: str
    threshold_value: float
    comparison_operator: str  # >, <, >=, <=, ==
    risk_level: RiskLevel
    block_execution: bool
    alert_required: bool

@dataclass
class DecisionContext:
    """Context information for decision making"""
    campaign_id: str
    platform: str
    current_performance: Dict[str, float]
    historical_performance: List[Dict[str, Any]]
    budget_constraints: Dict[str, float]
    business_goals: Dict[str, float]
    market_conditions: Dict[str, Any]
    competitor_analysis: Dict[str, Any]
    seasonal_factors: Dict[str, float]

@dataclass
class AutonomousDecision:
    """Autonomous decision with full context and reasoning"""
    decision_id: str
    decision_type: DecisionType
    campaign_id: str
    platform: str
    proposed_action: Dict[str, Any]
    reasoning: str
    confidence_score: float
    risk_level: RiskLevel
    expected_impact: Dict[str, float]
    safety_checks: List[Dict[str, Any]]
    approval_status: ApprovalStatus
    requires_human_approval: bool
    auto_execute_allowed: bool
    created_at: datetime
    expires_at: datetime
    executed_at: Optional[datetime] = None
    execution_results: Optional[Dict[str, Any]] = None

@dataclass
class ExecutionResult:
    """Result of decision execution"""
    decision_id: str
    success: bool
    execution_timestamp: datetime
    actual_impact: Dict[str, float]
    error_message: Optional[str]
    rollback_required: bool
    rollback_plan: Optional[Dict[str, Any]]

@dataclass
class LearningFeedback:
    """Feedback for learning and improvement"""
    decision_id: str
    actual_performance: Dict[str, float]
    predicted_performance: Dict[str, float]
    accuracy_score: float
    decision_quality: str  # excellent, good, fair, poor
    lessons_learned: List[str]
    model_adjustments: Dict[str, Any]

class AutonomousDecisionFramework:
    """
    Comprehensive Autonomous Decision Framework with safety guardrails
    """
    
    def __init__(self):
        self.safety_guardrails = []
        self.decision_history = []
        self.active_decisions = {}
        self.learning_data = []
        self.approval_workflows = {}
        self.emergency_protocols = {}
        self._initialize_default_guardrails()
        
    def _initialize_default_guardrails(self):
        """Initialize default safety guardrails"""
        self.safety_guardrails = [
            SafetyGuardrail(
                name="daily_budget_limit",
                description="Prevent daily budget increases above 50%",
                threshold_value=1.5,
                comparison_operator="<",
                risk_level=RiskLevel.HIGH,
                block_execution=True,
                alert_required=True
            ),
            SafetyGuardrail(
                name="minimum_roas_threshold",
                description="Ensure ROAS doesn't fall below 1.5x",
                threshold_value=1.5,
                comparison_operator=">=",
                risk_level=RiskLevel.CRITICAL,
                block_execution=True,
                alert_required=True
            ),
            SafetyGuardrail(
                name="maximum_spend_increase",
                description="Limit spend increases to 30% per day",
                threshold_value=1.3,
                comparison_operator="<",
                risk_level=RiskLevel.MEDIUM,
                block_execution=False,
                alert_required=True
            ),
            SafetyGuardrail(
                name="performance_decline_threshold",
                description="Alert on 20% performance decline",
                threshold_value=0.8,
                comparison_operator=">=",
                risk_level=RiskLevel.HIGH,
                block_execution=False,
                alert_required=True
            ),
            SafetyGuardrail(
                name="conversion_rate_floor",
                description="Prevent actions when conversion rate below 1%",
                threshold_value=0.01,
                comparison_operator=">=",
                risk_level=RiskLevel.HIGH,
                block_execution=True,
                alert_required=True
            )
        ]
    
    async def analyze_decision_opportunity(
        self, 
        context: DecisionContext,
        optimization_goals: Dict[str, float]
    ) -> List[AutonomousDecision]:
        """Analyze context and generate potential autonomous decisions"""
        try:
            decisions = []
            
            # Analyze budget optimization opportunities
            budget_decisions = await self._analyze_budget_opportunities(context, optimization_goals)
            decisions.extend(budget_decisions)
            
            # Analyze performance optimization opportunities  
            performance_decisions = await self._analyze_performance_opportunities(context, optimization_goals)
            decisions.extend(performance_decisions)
            
            # Analyze platform reallocation opportunities
            platform_decisions = await self._analyze_platform_opportunities(context, optimization_goals)
            decisions.extend(platform_decisions)
            
            # Analyze emergency interventions
            emergency_decisions = await self._analyze_emergency_situations(context)
            decisions.extend(emergency_decisions)
            
            # Apply safety checks to all decisions
            for decision in decisions:
                decision.safety_checks = await self._perform_safety_checks(decision, context)
                decision.requires_human_approval = self._requires_human_approval(decision)
                decision.auto_execute_allowed = self._auto_execution_allowed(decision)
            
            # Sort by impact and confidence
            decisions.sort(key=lambda d: (d.confidence_score * d.expected_impact.get('revenue_impact', 0)), reverse=True)
            
            return decisions
            
        except Exception as e:
            logger.error(f"Error analyzing decision opportunities: {e}")
            return []
    
    async def _analyze_budget_opportunities(
        self, 
        context: DecisionContext, 
        goals: Dict[str, float]
    ) -> List[AutonomousDecision]:
        """Analyze budget optimization opportunities"""
        decisions = []
        
        try:
            current_perf = context.current_performance
            budget_constraints = context.budget_constraints
            
            # Calculate current ROAS
            current_roas = current_perf.get('revenue', 0) / max(current_perf.get('spend', 1), 1)
            target_roas = goals.get('target_roas', 3.0)
            
            # Budget increase opportunity
            if current_roas > target_roas * 1.2:  # 20% above target
                current_budget = budget_constraints.get('daily_budget', 0)
                proposed_increase = min(current_budget * 0.3, budget_constraints.get('max_daily_budget', current_budget * 2))
                
                if proposed_increase > current_budget:
                    decision = AutonomousDecision(
                        decision_id=str(uuid.uuid4()),
                        decision_type=DecisionType.BUDGET_ADJUSTMENT,
                        campaign_id=context.campaign_id,
                        platform=context.platform,
                        proposed_action={
                            'action': 'increase_budget',
                            'current_budget': current_budget,
                            'new_budget': current_budget + proposed_increase,
                            'increase_percentage': (proposed_increase / current_budget) * 100
                        },
                        reasoning=f"High ROAS ({current_roas:.2f}x) indicates opportunity to scale. Proposing {(proposed_increase/current_budget)*100:.1f}% budget increase.",
                        confidence_score=0.8,
                        risk_level=RiskLevel.MEDIUM,
                        expected_impact={
                            'revenue_impact': proposed_increase * current_roas,
                            'spend_increase': proposed_increase,
                            'roi_improvement': 15.0
                        },
                        safety_checks=[],
                        approval_status=ApprovalStatus.PENDING,
                        requires_human_approval=False,
                        auto_execute_allowed=True,
                        created_at=datetime.now(),
                        expires_at=datetime.now() + timedelta(hours=2)
                    )
                    decisions.append(decision)
            
            # Budget decrease opportunity
            elif current_roas < target_roas * 0.7:  # 30% below target
                current_budget = budget_constraints.get('daily_budget', 0)
                proposed_decrease = current_budget * 0.2  # 20% decrease
                
                decision = AutonomousDecision(
                    decision_id=str(uuid.uuid4()),
                    decision_type=DecisionType.BUDGET_ADJUSTMENT,
                    campaign_id=context.campaign_id,
                    platform=context.platform,
                    proposed_action={
                        'action': 'decrease_budget',
                        'current_budget': current_budget,
                        'new_budget': current_budget - proposed_decrease,
                        'decrease_percentage': 20.0
                    },
                    reasoning=f"Low ROAS ({current_roas:.2f}x) indicates inefficient spending. Proposing 20% budget reduction to improve efficiency.",
                    confidence_score=0.7,
                    risk_level=RiskLevel.LOW,
                    expected_impact={
                        'cost_reduction': proposed_decrease,
                        'efficiency_gain': 25.0,
                        'roas_improvement': 0.5
                    },
                    safety_checks=[],
                    approval_status=ApprovalStatus.PENDING,
                    requires_human_approval=False,
                    auto_execute_allowed=True,
                    created_at=datetime.now(),
                    expires_at=datetime.now() + timedelta(hours=1)
                )
                decisions.append(decision)
            
            return decisions
            
        except Exception as e:
            logger.error(f"Error analyzing budget opportunities: {e}")
            return []
    
    async def _analyze_performance_opportunities(
        self, 
        context: DecisionContext, 
        goals: Dict[str, float]
    ) -> List[AutonomousDecision]:
        """Analyze performance optimization opportunities"""
        decisions = []
        
        try:
            current_perf = context.current_performance
            
            # Bid optimization opportunity
            cpc = current_perf.get('spend', 0) / max(current_perf.get('clicks', 1), 1)
            conversion_rate = current_perf.get('conversions', 0) / max(current_perf.get('clicks', 1), 1)
            
            if conversion_rate > 0.1:  # High conversion rate
                decision = AutonomousDecision(
                    decision_id=str(uuid.uuid4()),
                    decision_type=DecisionType.BID_OPTIMIZATION,
                    campaign_id=context.campaign_id,
                    platform=context.platform,
                    proposed_action={
                        'action': 'increase_bids',
                        'current_cpc': cpc,
                        'bid_adjustment': 15.0,  # 15% increase
                        'target_positions': [1, 2, 3]
                    },
                    reasoning=f"High conversion rate ({conversion_rate:.1%}) suggests opportunity for more aggressive bidding to capture additional traffic.",
                    confidence_score=0.75,
                    risk_level=RiskLevel.MEDIUM,
                    expected_impact={
                        'traffic_increase': 25.0,
                        'conversion_increase': 20.0,
                        'revenue_impact': current_perf.get('revenue', 0) * 0.2
                    },
                    safety_checks=[],
                    approval_status=ApprovalStatus.PENDING,
                    requires_human_approval=False,
                    auto_execute_allowed=True,
                    created_at=datetime.now(),
                    expires_at=datetime.now() + timedelta(hours=6)
                )
                decisions.append(decision)
            
            # Campaign pause recommendation
            elif conversion_rate < 0.01 and current_perf.get('spend', 0) > 100:  # Very low conversion rate with significant spend
                decision = AutonomousDecision(
                    decision_id=str(uuid.uuid4()),
                    decision_type=DecisionType.CAMPAIGN_PAUSE,
                    campaign_id=context.campaign_id,
                    platform=context.platform,
                    proposed_action={
                        'action': 'pause_campaign',
                        'reason': 'poor_performance',
                        'review_required': True,
                        'auto_resume_conditions': {
                            'min_conversion_rate': 0.02,
                            'max_cpa': current_perf.get('spend', 0) / max(current_perf.get('conversions', 1), 1) * 0.8
                        }
                    },
                    reasoning=f"Very low conversion rate ({conversion_rate:.1%}) with high spend indicates poor performance. Pausing to prevent further losses.",
                    confidence_score=0.9,
                    risk_level=RiskLevel.HIGH,
                    expected_impact={
                        'cost_savings': current_perf.get('spend', 0),
                        'loss_prevention': current_perf.get('spend', 0) * 0.8
                    },
                    safety_checks=[],
                    approval_status=ApprovalStatus.PENDING,
                    requires_human_approval=True,
                    auto_execute_allowed=False,
                    created_at=datetime.now(),
                    expires_at=datetime.now() + timedelta(minutes=30)
                )
                decisions.append(decision)
            
            return decisions
            
        except Exception as e:
            logger.error(f"Error analyzing performance opportunities: {e}")
            return []
    
    async def _analyze_platform_opportunities(
        self, 
        context: DecisionContext, 
        goals: Dict[str, float]
    ) -> List[AutonomousDecision]:
        """Analyze cross-platform reallocation opportunities"""
        decisions = []
        
        try:
            # This would integrate with the multi-platform sync engine
            # For now, provide a template decision
            
            current_roas = context.current_performance.get('revenue', 0) / max(context.current_performance.get('spend', 1), 1)
            
            if current_roas < 2.0:  # Below average performance
                decision = AutonomousDecision(
                    decision_id=str(uuid.uuid4()),
                    decision_type=DecisionType.PLATFORM_REALLOCATION,
                    campaign_id=context.campaign_id,
                    platform=context.platform,
                    proposed_action={
                        'action': 'reallocate_budget',
                        'from_platform': context.platform,
                        'to_platform': 'auto_detect_best_performer',
                        'reallocation_percentage': 25.0
                    },
                    reasoning=f"Platform performance below target. Consider reallocating 25% budget to better-performing platforms.",
                    confidence_score=0.6,
                    risk_level=RiskLevel.MEDIUM,
                    expected_impact={
                        'efficiency_gain': 20.0,
                        'cross_platform_optimization': True
                    },
                    safety_checks=[],
                    approval_status=ApprovalStatus.PENDING,
                    requires_human_approval=True,
                    auto_execute_allowed=False,
                    created_at=datetime.now(),
                    expires_at=datetime.now() + timedelta(hours=4)
                )
                decisions.append(decision)
            
            return decisions
            
        except Exception as e:
            logger.error(f"Error analyzing platform opportunities: {e}")
            return []
    
    async def _analyze_emergency_situations(self, context: DecisionContext) -> List[AutonomousDecision]:
        """Analyze emergency situations requiring immediate intervention"""
        decisions = []
        
        try:
            current_perf = context.current_performance
            
            # Emergency stop conditions
            daily_spend = current_perf.get('spend', 0)
            daily_revenue = current_perf.get('revenue', 0)
            daily_roas = daily_revenue / max(daily_spend, 1)
            
            # Emergency stop if ROAS is critically low and spend is high
            if daily_roas < 0.5 and daily_spend > 500:
                decision = AutonomousDecision(
                    decision_id=str(uuid.uuid4()),
                    decision_type=DecisionType.EMERGENCY_STOP,
                    campaign_id=context.campaign_id,
                    platform=context.platform,
                    proposed_action={
                        'action': 'emergency_stop',
                        'stop_all_campaigns': True,
                        'immediate_execution': True,
                        'alert_stakeholders': True
                    },
                    reasoning=f"CRITICAL: ROAS at {daily_roas:.2f}x with ${daily_spend:.2f} daily spend. Immediate intervention required to prevent significant losses.",
                    confidence_score=0.95,
                    risk_level=RiskLevel.CRITICAL,
                    expected_impact={
                        'loss_prevention': daily_spend * 5,  # Prevent 5 days of losses
                        'immediate_action': True
                    },
                    safety_checks=[],
                    approval_status=ApprovalStatus.AUTO_APPROVED,
                    requires_human_approval=False,
                    auto_execute_allowed=True,
                    created_at=datetime.now(),
                    expires_at=datetime.now() + timedelta(minutes=5)
                )
                decisions.append(decision)
            
            return decisions
            
        except Exception as e:
            logger.error(f"Error analyzing emergency situations: {e}")
            return []
    
    async def _perform_safety_checks(
        self, 
        decision: AutonomousDecision, 
        context: DecisionContext
    ) -> List[Dict[str, Any]]:
        """Perform safety checks against guardrails"""
        safety_results = []
        
        try:
            for guardrail in self.safety_guardrails:
                check_result = await self._evaluate_guardrail(guardrail, decision, context)
                safety_results.append(check_result)
                
                # Block execution if any critical guardrail fails
                if check_result['failed'] and guardrail.block_execution:
                    decision.auto_execute_allowed = False
                    decision.requires_human_approval = True
                    decision.risk_level = RiskLevel.CRITICAL
            
            return safety_results
            
        except Exception as e:
            logger.error(f"Error performing safety checks: {e}")
            return []
    
    async def _evaluate_guardrail(
        self, 
        guardrail: SafetyGuardrail, 
        decision: AutonomousDecision, 
        context: DecisionContext
    ) -> Dict[str, Any]:
        """Evaluate a specific guardrail against a decision"""
        try:
            # Extract relevant value based on guardrail name
            if guardrail.name == "daily_budget_limit":
                current_budget = context.budget_constraints.get('daily_budget', 0)
                proposed_budget = decision.proposed_action.get('new_budget', current_budget)
                test_value = proposed_budget / max(current_budget, 1)
            
            elif guardrail.name == "minimum_roas_threshold":
                test_value = context.current_performance.get('revenue', 0) / max(context.current_performance.get('spend', 1), 1)
            
            elif guardrail.name == "maximum_spend_increase":
                current_spend = context.current_performance.get('spend', 0)
                projected_spend = current_spend * decision.expected_impact.get('spend_multiplier', 1.0)
                test_value = projected_spend / max(current_spend, 1)
            
            else:
                test_value = 1.0  # Default safe value
            
            # Evaluate condition
            if guardrail.comparison_operator == ">":
                passed = test_value > guardrail.threshold_value
            elif guardrail.comparison_operator == "<":
                passed = test_value < guardrail.threshold_value
            elif guardrail.comparison_operator == ">=":
                passed = test_value >= guardrail.threshold_value
            elif guardrail.comparison_operator == "<=":
                passed = test_value <= guardrail.threshold_value
            else:
                passed = test_value == guardrail.threshold_value
            
            return {
                'guardrail_name': guardrail.name,
                'description': guardrail.description,
                'test_value': test_value,
                'threshold': guardrail.threshold_value,
                'operator': guardrail.comparison_operator,
                'passed': passed,
                'failed': not passed,
                'risk_level': guardrail.risk_level.value,
                'blocks_execution': guardrail.block_execution,
                'alert_required': guardrail.alert_required
            }
            
        except Exception as e:
            logger.error(f"Error evaluating guardrail {guardrail.name}: {e}")
            return {
                'guardrail_name': guardrail.name,
                'error': str(e),
                'passed': False,
                'failed': True
            }
    
    def _requires_human_approval(self, decision: AutonomousDecision) -> bool:
        """Determine if decision requires human approval"""
        # High risk or critical decisions always require approval
        if decision.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
            return True
        
        # Large budget changes require approval
        if decision.decision_type == DecisionType.BUDGET_ADJUSTMENT:
            budget_change = decision.proposed_action.get('increase_percentage', 0)
            if budget_change > 25:  # More than 25% change
                return True
        
        # Emergency stops are auto-approved
        if decision.decision_type == DecisionType.EMERGENCY_STOP:
            return False
        
        # Platform reallocations require approval
        if decision.decision_type == DecisionType.PLATFORM_REALLOCATION:
            return True
        
        return False
    
    def _auto_execution_allowed(self, decision: AutonomousDecision) -> bool:
        """Determine if decision can be auto-executed"""
        # Never auto-execute if human approval is required
        if decision.requires_human_approval:
            return False
        
        # Never auto-execute if safety checks failed
        for check in decision.safety_checks:
            if check.get('failed', False) and check.get('blocks_execution', False):
                return False
        
        # Emergency stops are always auto-executed
        if decision.decision_type == DecisionType.EMERGENCY_STOP:
            return True
        
        # Low risk decisions with high confidence can be auto-executed
        if decision.risk_level == RiskLevel.LOW and decision.confidence_score > 0.8:
            return True
        
        return False
    
    async def execute_decision(
        self, 
        decision: AutonomousDecision,
        force_execute: bool = False
    ) -> ExecutionResult:
        """Execute an autonomous decision with safety checks"""
        try:
            # Final safety check before execution
            if not force_execute:
                if decision.requires_human_approval and decision.approval_status != ApprovalStatus.APPROVED:
                    return ExecutionResult(
                        decision_id=decision.decision_id,
                        success=False,
                        execution_timestamp=datetime.now(),
                        actual_impact={},
                        error_message="Decision requires human approval",
                        rollback_required=False,
                        rollback_plan=None
                    )
                
                if not decision.auto_execute_allowed and not force_execute:
                    return ExecutionResult(
                        decision_id=decision.decision_id,
                        success=False,
                        execution_timestamp=datetime.now(),
                        actual_impact={},
                        error_message="Auto-execution not allowed",
                        rollback_required=False,
                        rollback_plan=None
                    )
            
            # Execute the decision based on type
            execution_result = await self._execute_decision_action(decision)
            
            # Update decision status
            decision.approval_status = ApprovalStatus.EXECUTED
            decision.executed_at = datetime.now()
            decision.execution_results = execution_result.__dict__
            
            # Store in decision history
            self.decision_history.append(decision)
            
            logger.info(f"Decision {decision.decision_id} executed successfully")
            return execution_result
            
        except Exception as e:
            logger.error(f"Error executing decision {decision.decision_id}: {e}")
            return ExecutionResult(
                decision_id=decision.decision_id,
                success=False,
                execution_timestamp=datetime.now(),
                actual_impact={},
                error_message=str(e),
                rollback_required=True,
                rollback_plan={'restore_previous_state': True}
            )
    
    async def _execute_decision_action(self, decision: AutonomousDecision) -> ExecutionResult:
        """Execute the specific action for a decision"""
        try:
            # This would integrate with the actual platform APIs
            # For now, simulate execution
            
            if decision.decision_type == DecisionType.BUDGET_ADJUSTMENT:
                # Simulate budget adjustment
                new_budget = decision.proposed_action.get('new_budget', 0)
                
                # Here you would call the actual platform API
                # await platform_api.update_budget(decision.campaign_id, new_budget)
                
                return ExecutionResult(
                    decision_id=decision.decision_id,
                    success=True,
                    execution_timestamp=datetime.now(),
                    actual_impact={
                        'budget_updated': True,
                        'new_budget': new_budget,
                        'change_applied': True
                    },
                    error_message=None,
                    rollback_required=False,
                    rollback_plan=None
                )
            
            elif decision.decision_type == DecisionType.EMERGENCY_STOP:
                # Simulate emergency stop
                return ExecutionResult(
                    decision_id=decision.decision_id,
                    success=True,
                    execution_timestamp=datetime.now(),
                    actual_impact={
                        'campaigns_paused': True,
                        'emergency_alert_sent': True,
                        'spending_stopped': True
                    },
                    error_message=None,
                    rollback_required=False,
                    rollback_plan={'resume_campaigns': True}
                )
            
            # Add more decision type executions here
            
            return ExecutionResult(
                decision_id=decision.decision_id,
                success=True,
                execution_timestamp=datetime.now(),
                actual_impact={'simulated_execution': True},
                error_message=None,
                rollback_required=False,
                rollback_plan=None
            )
            
        except Exception as e:
            logger.error(f"Error executing decision action: {e}")
            raise
    
    async def learn_from_outcomes(
        self, 
        decision_id: str, 
        actual_performance: Dict[str, float],
        timeframe_days: int = 7
    ) -> LearningFeedback:
        """Learn from decision outcomes to improve future decisions"""
        try:
            # Find the decision in history
            decision = next((d for d in self.decision_history if d.decision_id == decision_id), None)
            
            if not decision:
                raise ValueError(f"Decision {decision_id} not found in history")
            
            # Compare predicted vs actual impact
            predicted_impact = decision.expected_impact
            accuracy_scores = {}
            
            for metric, predicted_value in predicted_impact.items():
                actual_value = actual_performance.get(metric, 0)
                if predicted_value != 0:
                    accuracy = 1 - abs(predicted_value - actual_value) / abs(predicted_value)
                    accuracy_scores[metric] = max(0, accuracy)  # Don't allow negative accuracy
            
            overall_accuracy = sum(accuracy_scores.values()) / len(accuracy_scores) if accuracy_scores else 0
            
            # Determine decision quality
            if overall_accuracy >= 0.8:
                quality = "excellent"
            elif overall_accuracy >= 0.6:
                quality = "good"
            elif overall_accuracy >= 0.4:
                quality = "fair"
            else:
                quality = "poor"
            
            # Generate lessons learned
            lessons = []
            if overall_accuracy < 0.6:
                lessons.append("Prediction accuracy below acceptable threshold")
            if actual_performance.get('revenue_impact', 0) < predicted_impact.get('revenue_impact', 0):
                lessons.append("Revenue impact overestimated")
            if actual_performance.get('risk_materialized', False):
                lessons.append("Risk assessment was insufficient")
            
            learning_feedback = LearningFeedback(
                decision_id=decision_id,
                actual_performance=actual_performance,
                predicted_performance=predicted_impact,
                accuracy_score=overall_accuracy,
                decision_quality=quality,
                lessons_learned=lessons,
                model_adjustments={
                    'confidence_adjustment': -0.1 if overall_accuracy < 0.5 else 0.05,
                    'risk_sensitivity_adjustment': 0.1 if actual_performance.get('risk_materialized', False) else 0,
                    'prediction_model_update': True
                }
            )
            
            self.learning_data.append(learning_feedback)
            
            logger.info(f"Learning feedback recorded for decision {decision_id}: {quality} quality, {overall_accuracy:.2f} accuracy")
            return learning_feedback
            
        except Exception as e:
            logger.error(f"Error learning from outcomes: {e}")
            raise

# Export the main classes
__all__ = [
    'AutonomousDecisionFramework', 
    'AutonomousDecision', 
    'DecisionContext', 
    'ExecutionResult', 
    'LearningFeedback',
    'DecisionType',
    'RiskLevel',
    'ApprovalStatus'
]