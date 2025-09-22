"""
Real-Time Campaign Optimization Engine
Autonomous AI system for campaign performance optimization
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import math
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OptimizationType(Enum):
    BUDGET_INCREASE = "budget_increase"
    BUDGET_DECREASE = "budget_decrease"
    BID_INCREASE = "bid_increase"
    BID_DECREASE = "bid_decrease"
    PAUSE_CAMPAIGN = "pause_campaign"
    RESUME_CAMPAIGN = "resume_campaign"
    KEYWORD_BID_ADJUSTMENT = "keyword_bid_adjustment"
    AUDIENCE_OPTIMIZATION = "audience_optimization"

class Priority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class PerformanceMetrics:
    """Campaign performance metrics for optimization analysis"""
    campaign_id: str
    platform: str
    impressions: int
    clicks: int
    conversions: int
    spend: float
    revenue: float
    ctr: float
    cpc: float
    cpa: float
    roas: float
    quality_score: Optional[float] = None
    timestamp: datetime = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()

@dataclass
class OptimizationRecommendation:
    """AI optimization recommendation"""
    campaign_id: str
    optimization_type: OptimizationType
    current_value: float
    recommended_value: float
    expected_impact: str
    confidence_score: float
    priority: Priority
    reasoning: str
    estimated_improvement: Dict[str, float]
    risk_assessment: str
    auto_execute: bool = False
    created_at: datetime = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()

class CampaignOptimizationEngine:
    """Real-time campaign optimization AI engine"""
    
    def __init__(self):
        self.performance_thresholds = {
            'min_roas': 2.0,
            'max_cpa_multiplier': 1.5,  # 1.5x target CPA
            'min_ctr': 0.01,  # 1%
            'min_quality_score': 5.0,
            'budget_utilization_min': 0.8,  # 80%
            'budget_utilization_max': 0.95,  # 95%
        }
        
        self.optimization_rules = {
            'budget_increase_roas_threshold': 4.0,
            'budget_decrease_roas_threshold': 1.5,
            'bid_adjustment_performance_window': 7,  # days
            'min_data_points': 100,  # minimum clicks for reliable optimization
        }
        
        self.safety_limits = {
            'max_budget_increase_percentage': 50,  # 50%
            'max_budget_decrease_percentage': 30,  # 30%
            'max_bid_adjustment_percentage': 25,   # 25%
            'min_campaign_budget': 10.0,  # $10 minimum
        }

    async def analyze_campaign_performance(self, metrics: PerformanceMetrics) -> List[OptimizationRecommendation]:
        """Analyze campaign performance and generate optimization recommendations"""
        recommendations = []
        
        try:
            # Budget optimization analysis
            budget_rec = await self._analyze_budget_optimization(metrics)
            if budget_rec:
                recommendations.append(budget_rec)
            
            # Bid optimization analysis
            bid_rec = await self._analyze_bid_optimization(metrics)
            if bid_rec:
                recommendations.append(bid_rec)
            
            # Campaign health check
            health_recs = await self._analyze_campaign_health(metrics)
            recommendations.extend(health_recs)
            
            # Performance trend analysis
            trend_recs = await self._analyze_performance_trends(metrics)
            recommendations.extend(trend_recs)
            
        except Exception as e:
            logger.error(f"Error analyzing campaign {metrics.campaign_id}: {str(e)}")
        
        return recommendations

    async def _analyze_budget_optimization(self, metrics: PerformanceMetrics) -> Optional[OptimizationRecommendation]:
        """Analyze and recommend budget optimizations"""
        
        if metrics.roas >= self.optimization_rules['budget_increase_roas_threshold']:
            # High ROAS - recommend budget increase
            current_budget = await self._get_current_budget(metrics.campaign_id)
            increase_percentage = min(
                math.ceil((metrics.roas - 2.0) * 10),  # Scale with ROAS
                self.safety_limits['max_budget_increase_percentage']
            )
            
            new_budget = current_budget * (1 + increase_percentage / 100)
            
            return OptimizationRecommendation(
                campaign_id=metrics.campaign_id,
                optimization_type=OptimizationType.BUDGET_INCREASE,
                current_value=current_budget,
                recommended_value=new_budget,
                expected_impact=f"Estimated +{increase_percentage * metrics.roas:.0f}% revenue increase",
                confidence_score=0.85 if metrics.roas > 5.0 else 0.75,
                priority=Priority.HIGH if metrics.roas > 6.0 else Priority.MEDIUM,
                reasoning=f"High ROAS ({metrics.roas:.1f}x) indicates profitable scaling opportunity",
                estimated_improvement={
                    'revenue_increase_percentage': increase_percentage * (metrics.roas - 1),
                    'additional_daily_revenue': (new_budget - current_budget) * metrics.roas
                },
                risk_assessment="Low risk - strong performance indicators",
                auto_execute=metrics.roas > 5.0  # Auto-execute for very high ROAS
            )
        
        elif metrics.roas < self.optimization_rules['budget_decrease_roas_threshold']:
            # Low ROAS - recommend budget decrease or pause
            current_budget = await self._get_current_budget(metrics.campaign_id)
            
            if metrics.roas < 1.0:
                # Losing money - recommend pause
                return OptimizationRecommendation(
                    campaign_id=metrics.campaign_id,
                    optimization_type=OptimizationType.PAUSE_CAMPAIGN,
                    current_value=current_budget,
                    recommended_value=0,
                    expected_impact=f"Stop daily loss of ${current_budget * (1 - metrics.roas):.2f}",
                    confidence_score=0.95,
                    priority=Priority.CRITICAL,
                    reasoning=f"Campaign losing money with ROAS {metrics.roas:.2f}x",
                    estimated_improvement={
                        'daily_loss_prevented': current_budget * (1 - metrics.roas)
                    },
                    risk_assessment="High risk to continue - immediate action needed",
                    auto_execute=False  # Always require approval for pause
                )
            else:
                # Reduce budget
                decrease_percentage = min(
                    math.ceil((2.0 - metrics.roas) * 15),
                    self.safety_limits['max_budget_decrease_percentage']
                )
                
                new_budget = max(
                    current_budget * (1 - decrease_percentage / 100),
                    self.safety_limits['min_campaign_budget']
                )
                
                return OptimizationRecommendation(
                    campaign_id=metrics.campaign_id,
                    optimization_type=OptimizationType.BUDGET_DECREASE,
                    current_value=current_budget,
                    recommended_value=new_budget,
                    expected_impact=f"Reduce daily loss by ${(current_budget - new_budget) * (1 - metrics.roas):.2f}",
                    confidence_score=0.80,
                    priority=Priority.HIGH,
                    reasoning=f"Low ROAS ({metrics.roas:.2f}x) indicates budget reduction needed",
                    estimated_improvement={
                        'daily_loss_reduction': (current_budget - new_budget) * (1 - metrics.roas)
                    },
                    risk_assessment="Medium risk - monitor closely after adjustment"
                )
        
        return None

    async def _analyze_bid_optimization(self, metrics: PerformanceMetrics) -> Optional[OptimizationRecommendation]:
        """Analyze and recommend bid optimizations"""
        
        # Analyze CPC vs performance
        target_cpc = await self._get_target_cpc(metrics.campaign_id)
        
        if metrics.cpc > target_cpc * 1.2 and metrics.roas < 3.0:
            # CPC too high, reduce bids
            current_bid = await self._get_current_bid(metrics.campaign_id)
            reduction_percentage = min(
                math.ceil((metrics.cpc / target_cpc - 1) * 100),
                self.safety_limits['max_bid_adjustment_percentage']
            )
            
            new_bid = current_bid * (1 - reduction_percentage / 100)
            
            return OptimizationRecommendation(
                campaign_id=metrics.campaign_id,
                optimization_type=OptimizationType.BID_DECREASE,
                current_value=current_bid,
                recommended_value=new_bid,
                expected_impact=f"Reduce CPC by ~{reduction_percentage}%, maintain position",
                confidence_score=0.75,
                priority=Priority.MEDIUM,
                reasoning=f"CPC (${metrics.cpc:.2f}) exceeds target by {(metrics.cpc/target_cpc-1)*100:.0f}%",
                estimated_improvement={
                    'cost_reduction_percentage': reduction_percentage,
                    'daily_savings': metrics.clicks * (metrics.cpc - new_bid)
                },
                risk_assessment="Low risk - gradual bid reduction",
                auto_execute=True if reduction_percentage < 15 else False
            )
        
        elif metrics.roas > 4.0 and metrics.cpc < target_cpc * 0.8:
            # Great performance, can afford higher bids for more volume
            current_bid = await self._get_current_bid(metrics.campaign_id)
            increase_percentage = min(
                math.ceil((metrics.roas - 3.0) * 5),
                self.safety_limits['max_bid_adjustment_percentage']
            )
            
            new_bid = current_bid * (1 + increase_percentage / 100)
            
            return OptimizationRecommendation(
                campaign_id=metrics.campaign_id,
                optimization_type=OptimizationType.BID_INCREASE,
                current_value=current_bid,
                recommended_value=new_bid,
                expected_impact=f"Increase volume by ~{increase_percentage * 2}%",
                confidence_score=0.80,
                priority=Priority.MEDIUM,
                reasoning=f"Strong ROAS ({metrics.roas:.1f}x) allows aggressive bidding",
                estimated_improvement={
                    'volume_increase_percentage': increase_percentage * 2,
                    'additional_daily_revenue': metrics.revenue * 0.2
                },
                risk_assessment="Medium risk - monitor position and volume",
                auto_execute=True if increase_percentage < 20 else False
            )
        
        return None

    async def _analyze_campaign_health(self, metrics: PerformanceMetrics) -> List[OptimizationRecommendation]:
        """Analyze overall campaign health and identify issues"""
        recommendations = []
        
        # Low CTR analysis
        if metrics.ctr < self.performance_thresholds['min_ctr']:
            recommendations.append(OptimizationRecommendation(
                campaign_id=metrics.campaign_id,
                optimization_type=OptimizationType.AUDIENCE_OPTIMIZATION,
                current_value=metrics.ctr,
                recommended_value=self.performance_thresholds['min_ctr'],
                expected_impact="Improve ad relevance and reduce wasted spend",
                confidence_score=0.70,
                priority=Priority.MEDIUM,
                reasoning=f"CTR ({metrics.ctr:.2%}) below minimum threshold",
                estimated_improvement={
                    'ctr_improvement_needed': self.performance_thresholds['min_ctr'] - metrics.ctr
                },
                risk_assessment="Low risk - creative and targeting optimization needed",
                auto_execute=False
            ))
        
        # Quality Score issues (if available)
        if metrics.quality_score and metrics.quality_score < self.performance_thresholds['min_quality_score']:
            recommendations.append(OptimizationRecommendation(
                campaign_id=metrics.campaign_id,
                optimization_type=OptimizationType.KEYWORD_BID_ADJUSTMENT,
                current_value=metrics.quality_score,
                recommended_value=self.performance_thresholds['min_quality_score'],
                expected_impact="Reduce CPC and improve ad position",
                confidence_score=0.85,
                priority=Priority.HIGH,
                reasoning=f"Quality Score ({metrics.quality_score}) needs improvement",
                estimated_improvement={
                    'potential_cpc_reduction': 0.15  # 15% CPC reduction with better QS
                },
                risk_assessment="Low risk - keyword and landing page optimization needed",
                auto_execute=False
            ))
        
        return recommendations

    async def _analyze_performance_trends(self, metrics: PerformanceMetrics) -> List[OptimizationRecommendation]:
        """Analyze performance trends and predict optimizations"""
        # This would analyze historical data to identify trends
        # For now, return empty list as we'd need historical data
        return []

    async def _get_current_budget(self, campaign_id: str) -> float:
        """Get current campaign budget"""
        # Mock implementation - would connect to actual campaign management system
        return 100.0  # Default $100/day

    async def _get_target_cpc(self, campaign_id: str) -> float:
        """Get target CPC for campaign"""
        # Mock implementation
        return 1.50  # Default $1.50 target CPC

    async def _get_current_bid(self, campaign_id: str) -> float:
        """Get current bid amount"""
        # Mock implementation
        return 2.00  # Default $2.00 bid

    def calculate_optimization_score(self, metrics: PerformanceMetrics) -> float:
        """Calculate overall optimization score (0-100)"""
        score = 50  # Base score
        
        # ROAS contribution (40 points max)
        if metrics.roas >= 4.0:
            score += 40
        elif metrics.roas >= 3.0:
            score += 30
        elif metrics.roas >= 2.0:
            score += 20
        elif metrics.roas >= 1.0:
            score += 10
        
        # CTR contribution (20 points max)
        if metrics.ctr >= 0.03:  # 3%+
            score += 20
        elif metrics.ctr >= 0.02:  # 2%+
            score += 15
        elif metrics.ctr >= 0.01:  # 1%+
            score += 10
        
        # CPA efficiency (20 points max)
        # This would need target CPA data
        score += 15  # Default good score
        
        # Quality metrics (20 points max)
        if metrics.quality_score:
            if metrics.quality_score >= 8:
                score += 20
            elif metrics.quality_score >= 6:
                score += 15
            elif metrics.quality_score >= 4:
                score += 10
        else:
            score += 10  # Default when no QS data
        
        return min(100, max(0, score))

class OptimizationExecutor:
    """Executes approved optimizations"""
    
    def __init__(self):
        self.execution_log = []
    
    async def execute_optimization(self, recommendation: OptimizationRecommendation) -> Dict:
        """Execute an optimization recommendation"""
        try:
            # Log the execution attempt
            execution_record = {
                'campaign_id': recommendation.campaign_id,
                'optimization_type': recommendation.optimization_type.value,
                'timestamp': datetime.utcnow(),
                'status': 'attempting'
            }
            
            # Simulate API calls to advertising platforms
            if recommendation.optimization_type == OptimizationType.BUDGET_INCREASE:
                result = await self._update_campaign_budget(
                    recommendation.campaign_id,
                    recommendation.recommended_value
                )
            elif recommendation.optimization_type == OptimizationType.BUDGET_DECREASE:
                result = await self._update_campaign_budget(
                    recommendation.campaign_id,
                    recommendation.recommended_value
                )
            elif recommendation.optimization_type == OptimizationType.PAUSE_CAMPAIGN:
                result = await self._pause_campaign(recommendation.campaign_id)
            elif recommendation.optimization_type == OptimizationType.BID_INCREASE:
                result = await self._update_bid_strategy(
                    recommendation.campaign_id,
                    recommendation.recommended_value
                )
            elif recommendation.optimization_type == OptimizationType.BID_DECREASE:
                result = await self._update_bid_strategy(
                    recommendation.campaign_id,
                    recommendation.recommended_value
                )
            else:
                result = {'success': False, 'error': 'Optimization type not implemented'}
            
            execution_record['status'] = 'success' if result.get('success') else 'failed'
            execution_record['result'] = result
            self.execution_log.append(execution_record)
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to execute optimization: {str(e)}")
            return {'success': False, 'error': str(e)}

    async def _update_campaign_budget(self, campaign_id: str, new_budget: float) -> Dict:
        """Update campaign budget via platform API"""
        # Mock implementation - would integrate with Google Ads, Facebook, etc.
        await asyncio.sleep(0.1)  # Simulate API call
        return {
            'success': True,
            'message': f'Budget updated to ${new_budget:.2f}/day',
            'previous_budget': 100.0,
            'new_budget': new_budget
        }

    async def _pause_campaign(self, campaign_id: str) -> Dict:
        """Pause campaign via platform API"""
        await asyncio.sleep(0.1)
        return {
            'success': True,
            'message': 'Campaign paused successfully',
            'status': 'paused'
        }

    async def _update_bid_strategy(self, campaign_id: str, new_bid: float) -> Dict:
        """Update bid strategy via platform API"""
        await asyncio.sleep(0.1)
        return {
            'success': True,
            'message': f'Bid updated to ${new_bid:.2f}',
            'previous_bid': 2.00,
            'new_bid': new_bid
        }

# Example usage and testing
async def example_optimization_workflow():
    """Example of how the optimization engine works"""
    
    # Initialize engine
    engine = CampaignOptimizationEngine()
    executor = OptimizationExecutor()
    
    # Sample campaign metrics
    metrics = PerformanceMetrics(
        campaign_id="campaign_123",
        platform="google_ads",
        impressions=10000,
        clicks=300,
        conversions=25,
        spend=500.0,
        revenue=2500.0,
        ctr=0.03,
        cpc=1.67,
        cpa=20.0,
        roas=5.0,
        quality_score=7.5
    )
    
    # Analyze and get recommendations
    recommendations = await engine.analyze_campaign_performance(metrics)
    
    print(f"Found {len(recommendations)} optimization opportunities:")
    for rec in recommendations:
        print(f"\n- {rec.optimization_type.value}")
        print(f"  Priority: {rec.priority.value}")
        print(f"  Confidence: {rec.confidence_score:.0%}")
        print(f"  Expected Impact: {rec.expected_impact}")
        print(f"  Reasoning: {rec.reasoning}")
        
        # Execute if auto-approved
        if rec.auto_execute:
            result = await executor.execute_optimization(rec)
            print(f"  Execution: {'Success' if result.get('success') else 'Failed'}")

if __name__ == "__main__":
    asyncio.run(example_optimization_workflow())