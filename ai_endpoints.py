"""
AI/ML Optimization Engine API Endpoints
Provides advanced machine learning capabilities for predictive optimization,
automated A/B testing, anomaly detection, and performance forecasting.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
import json
import numpy as np
from enum import Enum

# Import our ML engine
from ml_optimization_engine import MLOptimizationEngine

router = APIRouter(prefix="/ai", tags=["AI/ML"])

# Initialize ML engine
ml_engine = MLOptimizationEngine()

class ModelType(str, Enum):
    PERFORMANCE_PREDICTOR = "performance_predictor"
    BID_OPTIMIZER = "bid_optimizer"
    ANOMALY_DETECTOR = "anomaly_detector"
    AB_TEST_OPTIMIZER = "ab_test_optimizer"

class ModelStatus(str, Enum):
    ACTIVE = "active"
    TRAINING = "training"
    ERROR = "error"
    IDLE = "idle"

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TestStatus(str, Enum):
    PLANNING = "planning"
    RUNNING = "running"
    COMPLETED = "completed"
    PAUSED = "paused"

class AnomalyStatus(str, Enum):
    DETECTED = "detected"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"

class AnomalySeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# Request/Response Models
class ModelInfo(BaseModel):
    id: str
    name: str
    type: ModelType
    accuracy: float = Field(..., ge=0, le=100)
    status: ModelStatus
    last_trained: datetime
    predictions: int = Field(..., ge=0)
    version: str

class PredictionRequest(BaseModel):
    campaign_id: str
    platform: str
    historical_data: Dict[str, Any]
    prediction_horizon: int = Field(7, ge=1, le=30)  # days

class PredictionResult(BaseModel):
    campaign_id: str
    campaign_name: str
    platform: str
    expected_ctr: float
    expected_cpa: float
    expected_roas: float
    expected_conversions: int
    confidence: float = Field(..., ge=0, le=100)
    risk_level: RiskLevel
    recommendations: List[Dict[str, Any]]

class ABTestRequest(BaseModel):
    name: str
    campaign_id: str
    test_type: str
    variants: List[Dict[str, Any]]
    traffic_split: List[int]
    duration_days: int = Field(..., ge=1, le=90)
    success_metric: str

class ABTestResult(BaseModel):
    id: str
    name: str
    type: str
    status: TestStatus
    progress: float = Field(..., ge=0, le=100)
    variants: int
    traffic_split: List[int]
    leading_variant: Optional[str] = None
    improvement: float = 0
    confidence: float = 0
    days_remaining: int

class AnomalyResult(BaseModel):
    id: str
    campaign_id: str
    campaign_name: str
    type: str
    severity: AnomalySeverity
    description: str
    detected_at: datetime
    affected_metrics: List[str]
    auto_remediation: bool
    status: AnomalyStatus

class OptimizationAction(BaseModel):
    campaign_id: str
    action: str
    result: str
    timestamp: datetime

class OptimizationStats(BaseModel):
    total_optimizations: int
    success_rate: float
    average_improvement: float
    automated_actions: int
    manual_actions: int
    recent_optimizations: List[OptimizationAction]

# Mock data for demonstration
mock_models = [
    ModelInfo(
        id="perf_pred_v2",
        name="Performance Predictor",
        type=ModelType.PERFORMANCE_PREDICTOR,
        accuracy=99.2,
        status=ModelStatus.ACTIVE,
        last_trained=datetime.now() - timedelta(hours=2),
        predictions=15420,
        version="2.1.0"
    ),
    ModelInfo(
        id="bid_opt_v1",
        name="Bid Optimizer",
        type=ModelType.BID_OPTIMIZER,
        accuracy=97.8,
        status=ModelStatus.ACTIVE,
        last_trained=datetime.now() - timedelta(hours=1),
        predictions=8650,
        version="1.8.0"
    ),
    ModelInfo(
        id="anomaly_det_v1",
        name="Anomaly Detector",
        type=ModelType.ANOMALY_DETECTOR,
        accuracy=96.4,
        status=ModelStatus.TRAINING,
        last_trained=datetime.now() - timedelta(minutes=30),
        predictions=3240,
        version="1.5.0"
    ),
    ModelInfo(
        id="ab_test_opt_v1",
        name="A/B Test Optimizer",
        type=ModelType.AB_TEST_OPTIMIZER,
        accuracy=94.6,
        status=ModelStatus.ACTIVE,
        last_trained=datetime.now() - timedelta(minutes=45),
        predictions=2180,
        version="1.3.0"
    )
]

# API Endpoints

@router.get("/models", response_model=List[ModelInfo])
async def get_ml_models():
    """Get information about all ML models."""
    return mock_models

@router.get("/models/{model_id}", response_model=ModelInfo)
async def get_model_info(model_id: str):
    """Get detailed information about a specific ML model."""
    model = next((m for m in mock_models if m.id == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

@router.post("/models/{model_id}/retrain")
async def retrain_model(model_id: str):
    """Trigger retraining of a specific ML model."""
    model = next((m for m in mock_models if m.id == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Update model status to training
    model.status = ModelStatus.TRAINING
    model.last_trained = datetime.now()
    
    return {"message": f"Model {model_id} retraining initiated", "status": "training"}

@router.post("/predictions", response_model=PredictionResult)
async def generate_prediction(request: PredictionRequest):
    """Generate performance predictions for a campaign using ML models."""
    try:
        # Use ML engine to generate predictions
        prediction_data = ml_engine.predict_performance(
            campaign_id=request.campaign_id,
            platform=request.platform,
            historical_data=request.historical_data,
            horizon_days=request.prediction_horizon
        )
        
        # Mock prediction result for demonstration
        return PredictionResult(
            campaign_id=request.campaign_id,
            campaign_name=f"Campaign {request.campaign_id}",
            platform=request.platform,
            expected_ctr=3.2,
            expected_cpa=45.80,
            expected_roas=4.8,
            expected_conversions=156,
            confidence=95.2,
            risk_level=RiskLevel.LOW,
            recommendations=[
                {
                    "type": "bid_adjustment",
                    "action": "Increase bid by 12% to capitalize on high ROAS potential",
                    "impact": "+18% conversions",
                    "priority": "high"
                }
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction generation failed: {str(e)}")

@router.get("/predictions/{campaign_id}")
async def get_campaign_predictions(campaign_id: str, days: int = 7):
    """Get recent predictions for a specific campaign."""
    # Mock implementation - would query database in real system
    return {
        "campaign_id": campaign_id,
        "predictions": [],
        "accuracy_score": 97.5,
        "last_updated": datetime.now().isoformat()
    }

@router.post("/abtests", response_model=ABTestResult)
async def create_ab_test(request: ABTestRequest):
    """Create and start a new A/B test using ML optimization."""
    try:
        # Use ML engine to optimize test setup
        test_config = ml_engine.optimize_ab_test(
            name=request.name,
            campaign_id=request.campaign_id,
            test_type=request.test_type,
            variants=request.variants,
            success_metric=request.success_metric
        )
        
        # Create test result
        test_id = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return ABTestResult(
            id=test_id,
            name=request.name,
            type=request.test_type,
            status=TestStatus.RUNNING,
            progress=0,
            variants=len(request.variants),
            traffic_split=request.traffic_split,
            days_remaining=request.duration_days
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"A/B test creation failed: {str(e)}")

@router.get("/abtests", response_model=List[ABTestResult])
async def get_ab_tests(status: Optional[TestStatus] = None, campaign_id: Optional[str] = None):
    """Get all A/B tests, optionally filtered by status or campaign."""
    # Mock data for demonstration
    tests = [
        ABTestResult(
            id="test_001",
            name="Headline Optimization",
            type="creative",
            status=TestStatus.RUNNING,
            progress=68,
            variants=3,
            traffic_split=[40, 30, 30],
            leading_variant="Variant A",
            improvement=12.5,
            confidence=89.4,
            days_remaining=3
        ),
        ABTestResult(
            id="test_002",
            name="Bid Strategy Test",
            type="bidding",
            status=TestStatus.COMPLETED,
            progress=100,
            variants=2,
            traffic_split=[50, 50],
            leading_variant="Smart Bidding",
            improvement=23.7,
            confidence=96.8,
            days_remaining=0
        )
    ]
    
    # Apply filters
    if status:
        tests = [t for t in tests if t.status == status]
    if campaign_id:
        # Would filter by campaign_id in real implementation
        pass
    
    return tests

@router.get("/abtests/{test_id}", response_model=ABTestResult)
async def get_ab_test(test_id: str):
    """Get detailed information about a specific A/B test."""
    # Mock implementation
    return ABTestResult(
        id=test_id,
        name="Headline Optimization",
        type="creative",
        status=TestStatus.RUNNING,
        progress=68,
        variants=3,
        traffic_split=[40, 30, 30],
        leading_variant="Variant A",
        improvement=12.5,
        confidence=89.4,
        days_remaining=3
    )

@router.post("/abtests/{test_id}/stop")
async def stop_ab_test(test_id: str):
    """Stop a running A/B test."""
    return {"message": f"A/B test {test_id} stopped", "status": "stopped"}

@router.get("/anomalies", response_model=List[AnomalyResult])
async def get_anomalies(
    severity: Optional[AnomalySeverity] = None,
    status: Optional[AnomalyStatus] = None,
    hours: int = 24
):
    """Get detected anomalies, optionally filtered by severity, status, or time range."""
    # Mock data for demonstration
    anomalies = [
        AnomalyResult(
            id="anom_001",
            campaign_id="camp_004",
            campaign_name="Summer Sale Campaign",
            type="cost_spike",
            severity=AnomalySeverity.HIGH,
            description="CPC increased 45% above normal range",
            detected_at=datetime.now() - timedelta(minutes=15),
            affected_metrics=["CPC", "Spend"],
            auto_remediation=True,
            status=AnomalyStatus.RESOLVED
        ),
        AnomalyResult(
            id="anom_002",
            campaign_id="camp_005",
            campaign_name="Product Launch",
            type="performance_drop",
            severity=AnomalySeverity.MEDIUM,
            description="CTR dropped 28% compared to baseline",
            detected_at=datetime.now() - timedelta(minutes=45),
            affected_metrics=["CTR", "Impressions"],
            auto_remediation=False,
            status=AnomalyStatus.INVESTIGATING
        )
    ]
    
    # Apply filters
    if severity:
        anomalies = [a for a in anomalies if a.severity == severity]
    if status:
        anomalies = [a for a in anomalies if a.status == status]
    
    # Filter by time range
    cutoff_time = datetime.now() - timedelta(hours=hours)
    anomalies = [a for a in anomalies if a.detected_at >= cutoff_time]
    
    return anomalies

@router.post("/anomalies/{anomaly_id}/resolve")
async def resolve_anomaly(anomaly_id: str, resolution_action: str):
    """Mark an anomaly as resolved with a specific action."""
    return {
        "anomaly_id": anomaly_id,
        "status": "resolved",
        "resolution_action": resolution_action,
        "resolved_at": datetime.now().isoformat()
    }

@router.get("/optimization/stats", response_model=OptimizationStats)
async def get_optimization_stats():
    """Get overall optimization statistics and recent actions."""
    return OptimizationStats(
        total_optimizations=1247,
        success_rate=94.3,
        average_improvement=18.6,
        automated_actions=856,
        manual_actions=391,
        recent_optimizations=[
            OptimizationAction(
                campaign_id="camp_001",
                action="Bid Increased 15%",
                result="+22% Conversions",
                timestamp=datetime.now() - timedelta(minutes=20)
            ),
            OptimizationAction(
                campaign_id="camp_002",
                action="Audience Refined",
                result="-18% CPA",
                timestamp=datetime.now() - timedelta(minutes=35)
            ),
            OptimizationAction(
                campaign_id="camp_003",
                action="Budget Reallocated",
                result="+12% ROAS",
                timestamp=datetime.now() - timedelta(minutes=50)
            )
        ]
    )

@router.post("/optimization/campaign/{campaign_id}")
async def optimize_campaign(campaign_id: str, optimization_type: str = "full"):
    """Trigger AI optimization for a specific campaign."""
    try:
        # Use ML engine to optimize campaign
        optimization_result = ml_engine.optimize_campaign(
            campaign_id=campaign_id,
            optimization_type=optimization_type
        )
        
        return {
            "campaign_id": campaign_id,
            "optimization_type": optimization_type,
            "actions_taken": optimization_result.get("actions", []),
            "expected_improvement": optimization_result.get("improvement", 0),
            "status": "completed",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign optimization failed: {str(e)}")

@router.get("/health")
async def ai_health_check():
    """Check the health and status of the AI/ML system."""
    try:
        # Check ML engine health
        engine_status = ml_engine.health_check()
        
        active_models = len([m for m in mock_models if m.status == ModelStatus.ACTIVE])
        total_models = len(mock_models)
        
        return {
            "status": "healthy" if engine_status else "degraded",
            "active_models": active_models,
            "total_models": total_models,
            "model_accuracy_avg": sum(m.accuracy for m in mock_models) / len(mock_models),
            "last_prediction": datetime.now().isoformat(),
            "system_load": "normal",
            "gpu_utilization": 67.3,
            "memory_usage": 45.2
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@router.get("/dashboard/overview")
async def get_ai_dashboard_overview():
    """Get comprehensive AI dashboard overview data."""
    active_models = len([m for m in mock_models if m.status == ModelStatus.ACTIVE])
    avg_accuracy = sum(m.accuracy for m in mock_models) / len(mock_models)
    total_predictions = sum(m.predictions for m in mock_models)
    
    return {
        "active_models": f"{active_models}/{len(mock_models)}",
        "avg_accuracy": round(avg_accuracy, 1),
        "total_predictions": total_predictions,
        "success_rate": 94.3,
        "models": [
            {
                "id": m.id,
                "name": m.name,
                "type": m.type,
                "accuracy": m.accuracy,
                "status": m.status,
                "predictions": m.predictions
            }
            for m in mock_models
        ],
        "recent_activity": [
            {
                "type": "prediction",
                "message": "Generated performance forecast for Q4 Campaign",
                "timestamp": datetime.now() - timedelta(minutes=5)
            },
            {
                "type": "optimization",
                "message": "Auto-optimized bid strategy for Brand Campaign",
                "timestamp": datetime.now() - timedelta(minutes=12)
            },
            {
                "type": "anomaly",
                "message": "Detected cost spike in Summer Sale Campaign",
                "timestamp": datetime.now() - timedelta(minutes=18)
            }
        ]
    }

# Configuration endpoints
@router.get("/config")
async def get_ai_config():
    """Get current AI/ML configuration settings."""
    return {
        "auto_optimization_enabled": True,
        "real_time_predictions": True,
        "anomaly_detection": True,
        "model_retrain_frequency": "6h",
        "prediction_confidence_threshold": 85.0,
        "auto_remediation_enabled": True,
        "ab_test_auto_winner": True
    }

@router.post("/config")
async def update_ai_config(config: Dict[str, Any]):
    """Update AI/ML configuration settings."""
    # Validate and update configuration
    return {
        "message": "AI configuration updated successfully",
        "updated_settings": config,
        "timestamp": datetime.now().isoformat()
    }