"""
Decision Execution Engine for Autonomous Campaign Management
Handles real-time decision execution with platform integrations
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, asdict
from enum import Enum
import uuid

from autonomous_decision_framework import (
    AutonomousDecision, DecisionType, RiskLevel, ApprovalStatus,
    ExecutionResult, AutonomousDecisionFramework
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PlatformType(Enum):
    """Supported advertising platforms"""
    GOOGLE_ADS = "google_ads"
    META_ADS = "meta_ads"  
    LINKEDIN_ADS = "linkedin_ads"
    MICROSOFT_ADS = "microsoft_ads"

class ExecutionStatus(Enum):
    """Execution status tracking"""
    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    ROLLED_BACK = "rolled_back"

@dataclass
class PlatformAction:
    """Platform-specific action definition"""
    platform: PlatformType
    action_type: str
    parameters: Dict[str, Any]
    api_endpoint: str
    method: str
    headers: Dict[str, str]
    payload: Dict[str, Any]
    retry_count: int = 3
    timeout_seconds: int = 30

@dataclass
class ExecutionQueue:
    """Queue for managing decision executions"""
    execution_id: str
    decision: AutonomousDecision
    platform_actions: List[PlatformAction]
    status: ExecutionStatus
    priority: int  # 1 = highest, 5 = lowest
    scheduled_time: datetime
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_details: Optional[Dict[str, Any]] = None

@dataclass
class ExecutionMonitor:
    """Monitor execution progress and health"""
    execution_id: str
    start_time: datetime
    expected_duration: timedelta
    progress_percentage: float
    current_action: str
    health_status: str  # healthy, warning, critical
    performance_metrics: Dict[str, float]
    alerts_triggered: List[str]

class DecisionExecutionEngine:
    """
    Advanced Decision Execution Engine with platform integrations
    """
    
    def __init__(self):
        self.execution_queue: List[ExecutionQueue] = []
        self.active_executions: Dict[str, ExecutionMonitor] = {}
        self.execution_history: List[ExecutionQueue] = []
        self.platform_connectors = {}
        self.approval_workflows = {}
        self.rollback_strategies = {}
        self._initialize_platform_connectors()
        self._initialize_rollback_strategies()
        
    def _initialize_platform_connectors(self):
        """Initialize platform API connectors"""
        # This would be replaced with actual API connectors
        self.platform_connectors = {
            PlatformType.GOOGLE_ADS: self._mock_google_ads_connector,
            PlatformType.META_ADS: self._mock_meta_ads_connector,
            PlatformType.LINKEDIN_ADS: self._mock_linkedin_ads_connector,
        }
    
    def _initialize_rollback_strategies(self):
        """Initialize rollback strategies for different decision types"""
        self.rollback_strategies = {
            DecisionType.BUDGET_ADJUSTMENT: self._rollback_budget_change,
            DecisionType.BID_OPTIMIZATION: self._rollback_bid_change,
            DecisionType.CAMPAIGN_PAUSE: self._rollback_campaign_pause,
            DecisionType.TARGETING_ADJUSTMENT: self._rollback_targeting_change,
        }
    
    async def queue_decision_execution(
        self, 
        decision: AutonomousDecision,
        priority: int = 3,
        scheduled_time: Optional[datetime] = None
    ) -> str:
        """Queue a decision for execution"""
        try:
            execution_id = str(uuid.uuid4())
            
            # Convert decision to platform actions
            platform_actions = await self._convert_decision_to_actions(decision)
            
            # Create execution queue item
            queue_item = ExecutionQueue(
                execution_id=execution_id,
                decision=decision,
                platform_actions=platform_actions,
                status=ExecutionStatus.QUEUED,
                priority=priority,
                scheduled_time=scheduled_time or datetime.now(),
                created_at=datetime.now()
            )
            
            # Add to queue (sort by priority and scheduled time)
            self.execution_queue.append(queue_item)
            self.execution_queue.sort(key=lambda x: (x.priority, x.scheduled_time))
            
            logger.info(f"Decision {decision.decision_id} queued for execution with ID {execution_id}")
            return execution_id
            
        except Exception as e:
            logger.error(f"Error queuing decision execution: {e}")
            raise
    
    async def _convert_decision_to_actions(self, decision: AutonomousDecision) -> List[PlatformAction]:
        """Convert a decision into platform-specific actions"""
        actions = []
        
        try:
            platform_type = PlatformType(decision.platform)
            
            if decision.decision_type == DecisionType.BUDGET_ADJUSTMENT:
                action = PlatformAction(
                    platform=platform_type,
                    action_type="update_budget",
                    parameters={
                        'campaign_id': decision.campaign_id,
                        'new_budget': decision.proposed_action.get('new_budget'),
                        'budget_type': 'daily'
                    },
                    api_endpoint=f"/campaigns/{decision.campaign_id}/budget",
                    method="PUT",
                    headers={'Content-Type': 'application/json'},
                    payload={
                        'daily_budget_micros': int(decision.proposed_action.get('new_budget', 0) * 1000000),
                        'delivery_method': 'STANDARD'
                    }
                )
                actions.append(action)
            
            elif decision.decision_type == DecisionType.BID_OPTIMIZATION:
                action = PlatformAction(
                    platform=platform_type,
                    action_type="update_bids",
                    parameters={
                        'campaign_id': decision.campaign_id,
                        'bid_adjustment': decision.proposed_action.get('bid_adjustment'),
                        'target_positions': decision.proposed_action.get('target_positions', [])
                    },
                    api_endpoint=f"/campaigns/{decision.campaign_id}/bidding",
                    method="PUT",
                    headers={'Content-Type': 'application/json'},
                    payload={
                        'bid_adjustment_percentage': decision.proposed_action.get('bid_adjustment'),
                        'bidding_strategy': 'TARGET_CPA'
                    }
                )
                actions.append(action)
            
            elif decision.decision_type == DecisionType.CAMPAIGN_PAUSE:
                action = PlatformAction(
                    platform=platform_type,
                    action_type="pause_campaign",
                    parameters={
                        'campaign_id': decision.campaign_id,
                        'pause_reason': decision.proposed_action.get('reason')
                    },
                    api_endpoint=f"/campaigns/{decision.campaign_id}/status",
                    method="PUT",
                    headers={'Content-Type': 'application/json'},
                    payload={
                        'status': 'PAUSED',
                        'pause_reason': decision.proposed_action.get('reason', 'automated_optimization')
                    }
                )
                actions.append(action)
            
            elif decision.decision_type == DecisionType.EMERGENCY_STOP:
                # Emergency stop affects all campaigns
                action = PlatformAction(
                    platform=platform_type,
                    action_type="emergency_stop",
                    parameters={
                        'stop_all': True,
                        'immediate': True
                    },
                    api_endpoint="/emergency/stop",
                    method="POST",
                    headers={'Content-Type': 'application/json'},
                    payload={
                        'action': 'PAUSE_ALL_CAMPAIGNS',
                        'reason': 'EMERGENCY_STOP',
                        'immediate': True
                    }
                )
                actions.append(action)
            
            return actions
            
        except Exception as e:
            logger.error(f"Error converting decision to actions: {e}")
            return []
    
    async def execute_next_queued_decision(self) -> Optional[ExecutionResult]:
        """Execute the next decision in the queue"""
        try:
            # Find next ready-to-execute decision
            now = datetime.now()
            ready_items = [
                item for item in self.execution_queue 
                if item.status == ExecutionStatus.QUEUED and item.scheduled_time <= now
            ]
            
            if not ready_items:
                return None
            
            # Get highest priority item
            queue_item = ready_items[0]
            
            # Remove from queue and mark as in progress
            self.execution_queue.remove(queue_item)
            queue_item.status = ExecutionStatus.IN_PROGRESS
            queue_item.started_at = datetime.now()
            
            # Create execution monitor
            monitor = ExecutionMonitor(
                execution_id=queue_item.execution_id,
                start_time=datetime.now(),
                expected_duration=timedelta(minutes=5),
                progress_percentage=0.0,
                current_action="initializing",
                health_status="healthy",
                performance_metrics={},
                alerts_triggered=[]
            )
            self.active_executions[queue_item.execution_id] = monitor
            
            # Execute the decision
            result = await self._execute_platform_actions(queue_item, monitor)
            
            # Update queue item status
            queue_item.status = ExecutionStatus.COMPLETED if result.success else ExecutionStatus.FAILED
            queue_item.completed_at = datetime.now()
            if not result.success:
                queue_item.error_details = {'error': result.error_message}
            
            # Move to history
            self.execution_history.append(queue_item)
            
            # Clean up monitor
            if queue_item.execution_id in self.active_executions:
                del self.active_executions[queue_item.execution_id]
            
            logger.info(f"Execution {queue_item.execution_id} completed: {'success' if result.success else 'failed'}")
            return result
            
        except Exception as e:
            logger.error(f"Error executing queued decision: {e}")
            return None
    
    async def _execute_platform_actions(
        self, 
        queue_item: ExecutionQueue, 
        monitor: ExecutionMonitor
    ) -> ExecutionResult:
        """Execute all platform actions for a queued decision"""
        try:
            total_actions = len(queue_item.platform_actions)
            completed_actions = 0
            action_results = []
            
            for i, action in enumerate(queue_item.platform_actions):
                try:
                    # Update monitor
                    monitor.current_action = f"{action.action_type} on {action.platform.value}"
                    monitor.progress_percentage = (i / total_actions) * 100
                    
                    # Execute platform action
                    action_result = await self._execute_single_platform_action(action)
                    action_results.append(action_result)
                    
                    if action_result['success']:
                        completed_actions += 1
                    else:
                        # If any action fails, consider rolling back previous actions
                        if i > 0:  # There are previous actions to potentially rollback
                            await self._handle_partial_execution_failure(queue_item, action_results)
                        
                        return ExecutionResult(
                            decision_id=queue_item.decision.decision_id,
                            success=False,
                            execution_timestamp=datetime.now(),
                            actual_impact={'partial_execution': True, 'completed_actions': completed_actions},
                            error_message=action_result.get('error', 'Platform action failed'),
                            rollback_required=True,
                            rollback_plan={'actions_to_rollback': action_results[:i]}
                        )
                
                except Exception as e:
                    logger.error(f"Error executing platform action {action.action_type}: {e}")
                    return ExecutionResult(
                        decision_id=queue_item.decision.decision_id,
                        success=False,
                        execution_timestamp=datetime.now(),
                        actual_impact={},
                        error_message=str(e),
                        rollback_required=True,
                        rollback_plan={'actions_to_rollback': action_results}
                    )
            
            # All actions completed successfully
            monitor.progress_percentage = 100.0
            monitor.current_action = "completed"
            
            # Calculate actual impact
            actual_impact = self._calculate_execution_impact(action_results)
            
            return ExecutionResult(
                decision_id=queue_item.decision.decision_id,
                success=True,
                execution_timestamp=datetime.now(),
                actual_impact=actual_impact,
                error_message=None,
                rollback_required=False,
                rollback_plan=None
            )
            
        except Exception as e:
            logger.error(f"Error executing platform actions: {e}")
            return ExecutionResult(
                decision_id=queue_item.decision.decision_id,
                success=False,
                execution_timestamp=datetime.now(),
                actual_impact={},
                error_message=str(e),
                rollback_required=True,
                rollback_plan={'full_rollback': True}
            )
    
    async def _execute_single_platform_action(self, action: PlatformAction) -> Dict[str, Any]:
        """Execute a single platform action"""
        try:
            # Get platform connector
            connector = self.platform_connectors.get(action.platform)
            if not connector:
                return {
                    'success': False,
                    'error': f"No connector found for platform {action.platform.value}",
                    'action_type': action.action_type
                }
            
            # Execute the action with retry logic
            for attempt in range(action.retry_count):
                try:
                    result = await connector(action)
                    if result.get('success', False):
                        return result
                    
                    # If not successful and not the last attempt, wait before retry
                    if attempt < action.retry_count - 1:
                        await asyncio.sleep(2 ** attempt)  # Exponential backoff
                
                except Exception as e:
                    if attempt == action.retry_count - 1:  # Last attempt
                        raise e
                    await asyncio.sleep(2 ** attempt)
            
            return {
                'success': False,
                'error': f"Failed after {action.retry_count} attempts",
                'action_type': action.action_type
            }
            
        except Exception as e:
            logger.error(f"Error executing platform action: {e}")
            return {
                'success': False,
                'error': str(e),
                'action_type': action.action_type
            }
    
    def _calculate_execution_impact(self, action_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate the actual impact of executed actions"""
        impact = {
            'actions_executed': len(action_results),
            'successful_actions': sum(1 for r in action_results if r.get('success', False)),
            'failed_actions': sum(1 for r in action_results if not r.get('success', False)),
            'execution_summary': {}
        }
        
        # Aggregate specific impacts
        for result in action_results:
            if result.get('success', False) and 'impact' in result:
                action_impact = result['impact']
                for key, value in action_impact.items():
                    if key in impact['execution_summary']:
                        impact['execution_summary'][key] += value
                    else:
                        impact['execution_summary'][key] = value
        
        return impact
    
    async def _handle_partial_execution_failure(
        self, 
        queue_item: ExecutionQueue, 
        completed_actions: List[Dict[str, Any]]
    ):
        """Handle partial execution failure with potential rollback"""
        try:
            logger.warning(f"Partial execution failure for {queue_item.execution_id}, considering rollback")
            
            # Check if rollback is required based on decision type
            decision_type = queue_item.decision.decision_type
            
            if decision_type in self.rollback_strategies:
                rollback_strategy = self.rollback_strategies[decision_type]
                await rollback_strategy(queue_item, completed_actions)
            
        except Exception as e:
            logger.error(f"Error handling partial execution failure: {e}")
    
    async def rollback_execution(self, execution_id: str) -> bool:
        """Rollback a previously executed decision"""
        try:
            # Find execution in history
            execution = next(
                (ex for ex in self.execution_history if ex.execution_id == execution_id), 
                None
            )
            
            if not execution:
                logger.error(f"Execution {execution_id} not found in history")
                return False
            
            if execution.status != ExecutionStatus.COMPLETED:
                logger.error(f"Cannot rollback execution {execution_id} with status {execution.status}")
                return False
            
            # Execute rollback strategy
            decision_type = execution.decision.decision_type
            if decision_type in self.rollback_strategies:
                rollback_strategy = self.rollback_strategies[decision_type]
                success = await rollback_strategy(execution, None, rollback=True)
                
                if success:
                    execution.status = ExecutionStatus.ROLLED_BACK
                    logger.info(f"Successfully rolled back execution {execution_id}")
                    return True
            
            logger.error(f"No rollback strategy found for decision type {decision_type}")
            return False
            
        except Exception as e:
            logger.error(f"Error rolling back execution {execution_id}: {e}")
            return False
    
    # Rollback strategy implementations
    async def _rollback_budget_change(
        self, 
        queue_item: ExecutionQueue, 
        completed_actions: Optional[List[Dict[str, Any]]] = None,
        rollback: bool = False
    ) -> bool:
        """Rollback budget change to previous value"""
        try:
            # Extract original budget from decision context
            decision = queue_item.decision
            original_budget = decision.proposed_action.get('current_budget', 0)
            
            # Create rollback action
            rollback_action = PlatformAction(
                platform=PlatformType(decision.platform),
                action_type="rollback_budget",
                parameters={
                    'campaign_id': decision.campaign_id,
                    'original_budget': original_budget
                },
                api_endpoint=f"/campaigns/{decision.campaign_id}/budget",
                method="PUT",
                headers={'Content-Type': 'application/json'},
                payload={
                    'daily_budget_micros': int(original_budget * 1000000),
                    'delivery_method': 'STANDARD'
                }
            )
            
            # Execute rollback
            connector = self.platform_connectors.get(PlatformType(decision.platform))
            if connector:
                result = await connector(rollback_action)
                return result.get('success', False)
            
            return False
            
        except Exception as e:
            logger.error(f"Error rolling back budget change: {e}")
            return False
    
    async def _rollback_bid_change(
        self, 
        queue_item: ExecutionQueue, 
        completed_actions: Optional[List[Dict[str, Any]]] = None,
        rollback: bool = False
    ) -> bool:
        """Rollback bid changes to previous values"""
        try:
            # Implementation would restore previous bid values
            logger.info(f"Rolling back bid changes for {queue_item.decision.campaign_id}")
            return True  # Simplified for demo
            
        except Exception as e:
            logger.error(f"Error rolling back bid change: {e}")
            return False
    
    async def _rollback_campaign_pause(
        self, 
        queue_item: ExecutionQueue, 
        completed_actions: Optional[List[Dict[str, Any]]] = None,
        rollback: bool = False
    ) -> bool:
        """Rollback campaign pause (resume campaign)"""
        try:
            # Implementation would resume the campaign
            logger.info(f"Rolling back campaign pause for {queue_item.decision.campaign_id}")
            return True  # Simplified for demo
            
        except Exception as e:
            logger.error(f"Error rolling back campaign pause: {e}")
            return False
    
    async def _rollback_targeting_change(
        self, 
        queue_item: ExecutionQueue, 
        completed_actions: Optional[List[Dict[str, Any]]] = None,
        rollback: bool = False
    ) -> bool:
        """Rollback targeting changes to previous settings"""
        try:
            # Implementation would restore previous targeting settings
            logger.info(f"Rolling back targeting changes for {queue_item.decision.campaign_id}")
            return True  # Simplified for demo
            
        except Exception as e:
            logger.error(f"Error rolling back targeting change: {e}")
            return False
    
    # Mock platform connectors (would be replaced with real API connectors)
    async def _mock_google_ads_connector(self, action: PlatformAction) -> Dict[str, Any]:
        """Mock Google Ads API connector"""
        await asyncio.sleep(0.5)  # Simulate API call delay
        
        return {
            'success': True,
            'platform': 'google_ads',
            'action_type': action.action_type,
            'campaign_id': action.parameters.get('campaign_id'),
            'impact': {
                'budget_updated': action.action_type == 'update_budget',
                'bids_updated': action.action_type == 'update_bids',
                'status_changed': action.action_type in ['pause_campaign', 'emergency_stop']
            },
            'response_time_ms': 500
        }
    
    async def _mock_meta_ads_connector(self, action: PlatformAction) -> Dict[str, Any]:
        """Mock Meta Ads API connector"""
        await asyncio.sleep(0.3)  # Simulate API call delay
        
        return {
            'success': True,
            'platform': 'meta_ads',
            'action_type': action.action_type,
            'campaign_id': action.parameters.get('campaign_id'),
            'impact': {
                'budget_updated': action.action_type == 'update_budget',
                'optimization_applied': action.action_type == 'update_bids'
            },
            'response_time_ms': 300
        }
    
    async def _mock_linkedin_ads_connector(self, action: PlatformAction) -> Dict[str, Any]:
        """Mock LinkedIn Ads API connector"""
        await asyncio.sleep(0.4)  # Simulate API call delay
        
        return {
            'success': True,
            'platform': 'linkedin_ads',
            'action_type': action.action_type,
            'campaign_id': action.parameters.get('campaign_id'),
            'impact': {
                'professional_targeting_updated': True,
                'budget_allocated': action.action_type == 'update_budget'
            },
            'response_time_ms': 400
        }
    
    # Monitoring and status methods
    def get_execution_status(self, execution_id: str) -> Optional[Dict[str, Any]]:
        """Get current status of an execution"""
        # Check active executions
        if execution_id in self.active_executions:
            monitor = self.active_executions[execution_id]
            return {
                'execution_id': execution_id,
                'status': 'in_progress',
                'progress_percentage': monitor.progress_percentage,
                'current_action': monitor.current_action,
                'health_status': monitor.health_status,
                'start_time': monitor.start_time.isoformat(),
                'performance_metrics': monitor.performance_metrics
            }
        
        # Check execution history
        execution = next(
            (ex for ex in self.execution_history if ex.execution_id == execution_id), 
            None
        )
        
        if execution:
            return {
                'execution_id': execution_id,
                'status': execution.status.value,
                'decision_id': execution.decision.decision_id,
                'created_at': execution.created_at.isoformat(),
                'started_at': execution.started_at.isoformat() if execution.started_at else None,
                'completed_at': execution.completed_at.isoformat() if execution.completed_at else None,
                'error_details': execution.error_details
            }
        
        return None
    
    def get_queue_status(self) -> Dict[str, Any]:
        """Get current queue status"""
        return {
            'total_queued': len(self.execution_queue),
            'active_executions': len(self.active_executions),
            'completed_executions': len([ex for ex in self.execution_history if ex.status == ExecutionStatus.COMPLETED]),
            'failed_executions': len([ex for ex in self.execution_history if ex.status == ExecutionStatus.FAILED]),
            'queue_items': [
                {
                    'execution_id': item.execution_id,
                    'decision_type': item.decision.decision_type.value,
                    'priority': item.priority,
                    'scheduled_time': item.scheduled_time.isoformat()
                }
                for item in self.execution_queue
            ]
        }

# Export main classes
__all__ = [
    'DecisionExecutionEngine',
    'PlatformAction', 
    'ExecutionQueue',
    'ExecutionMonitor',
    'PlatformType',
    'ExecutionStatus'
]