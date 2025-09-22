"""
Advanced Analytics Engine for PulseBridge.ai
Provides sophisticated analytics with predictive modeling, trend analysis, and AI insights
"""

import asyncio
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Union
from dataclasses import dataclass
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PredictiveMetrics:
    """Predictive analytics metrics and forecasts"""
    forecast_period: int  # Days
    predicted_impressions: float
    predicted_clicks: float
    predicted_conversions: float
    predicted_spend: float
    predicted_revenue: float
    confidence_score: float
    trend_direction: str  # 'up', 'down', 'stable'
    seasonal_factors: Dict[str, float]
    risk_factors: List[str]

@dataclass
class CrossPlatformCorrelation:
    """Cross-platform performance correlation analysis"""
    platform_a: str
    platform_b: str
    correlation_score: float  # -1 to 1
    correlation_type: str  # 'positive', 'negative', 'neutral'
    shared_audience_overlap: float
    budget_cannibalization_risk: float
    optimization_opportunity: str

@dataclass
class PerformanceTrend:
    """Performance trend analysis"""
    metric_name: str
    current_value: float
    trend_direction: str
    trend_strength: float  # 0-1
    weekly_change: float
    monthly_change: float
    seasonal_pattern: Dict[str, float]
    anomaly_detected: bool
    anomaly_severity: str  # 'low', 'medium', 'high'

@dataclass
class AIInsight:
    """AI-generated insights and recommendations"""
    insight_type: str
    confidence: float
    impact_score: float  # 0-100
    title: str
    description: str
    recommendation: str
    priority: str  # 'low', 'medium', 'high', 'critical'
    estimated_impact: Dict[str, float]
    implementation_effort: str  # 'low', 'medium', 'high'

class AdvancedAnalyticsEngine:
    """
    Advanced Analytics Engine with predictive modeling and AI insights
    """
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.feature_importance = {}
        self.historical_accuracy = {}
        
    async def initialize_models(self) -> bool:
        """Initialize and load ML models for predictive analytics"""
        try:
            # Initialize base models for different metrics
            self.models = {
                'impressions': RandomForestRegressor(n_estimators=100, random_state=42),
                'clicks': RandomForestRegressor(n_estimators=100, random_state=42),
                'conversions': RandomForestRegressor(n_estimators=100, random_state=42),
                'spend': RandomForestRegressor(n_estimators=100, random_state=42),
                'revenue': RandomForestRegressor(n_estimators=100, random_state=42)
            }
            
            self.scalers = {metric: StandardScaler() for metric in self.models.keys()}
            
            logger.info("Analytics models initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize models: {e}")
            return False
    
    def prepare_features(self, historical_data: List[Dict]) -> pd.DataFrame:
        """Prepare features for machine learning models"""
        try:
            df = pd.DataFrame(historical_data)
            
            # Convert date column
            df['date'] = pd.to_datetime(df['date'])
            df = df.sort_values('date')
            
            # Create time-based features
            df['day_of_week'] = df['date'].dt.dayofweek
            df['day_of_month'] = df['date'].dt.day
            df['month'] = df['date'].dt.month
            df['quarter'] = df['date'].dt.quarter
            df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
            df['days_since_start'] = (df['date'] - df['date'].min()).dt.days
            
            # Create lag features (previous day performance)
            lag_columns = ['impressions', 'clicks', 'conversions', 'spend', 'revenue']
            for col in lag_columns:
                if col in df.columns:
                    df[f'{col}_lag1'] = df[col].shift(1)
                    df[f'{col}_lag7'] = df[col].shift(7)  # Week ago
                    df[f'{col}_rolling7'] = df[col].rolling(window=7).mean()
            
            # Create derived metrics
            df['ctr'] = df['clicks'] / df['impressions'].replace(0, 1)
            df['cpc'] = df['spend'] / df['clicks'].replace(0, 1)
            df['conversion_rate'] = df['conversions'] / df['clicks'].replace(0, 1)
            df['roas'] = df['revenue'] / df['spend'].replace(0, 1)
            
            # Platform encoding (if multiple platforms)
            if 'platform' in df.columns:
                df = pd.get_dummies(df, columns=['platform'], prefix='platform')
            
            # Fill NaN values
            df = df.fillna(0)
            
            return df
            
        except Exception as e:
            logger.error(f"Error preparing features: {e}")
            return pd.DataFrame()
    
    async def train_predictive_models(self, historical_data: List[Dict]) -> Dict[str, float]:
        """Train predictive models on historical performance data"""
        try:
            df = self.prepare_features(historical_data)
            
            if df.empty:
                return {}
            
            # Define feature columns (exclude target and date columns)
            target_columns = ['impressions', 'clicks', 'conversions', 'spend', 'revenue']
            feature_columns = [col for col in df.columns if col not in target_columns + ['date', 'campaign_id']]
            
            model_scores = {}
            
            for target in target_columns:
                if target not in df.columns:
                    continue
                    
                # Prepare data
                X = df[feature_columns]
                y = df[target]
                
                # Skip if insufficient data
                if len(X) < 10:
                    continue
                
                # Split data
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y, test_size=0.2, random_state=42
                )
                
                # Scale features
                X_train_scaled = self.scalers[target].fit_transform(X_train)
                X_test_scaled = self.scalers[target].transform(X_test)
                
                # Train model
                self.models[target].fit(X_train_scaled, y_train)
                
                # Evaluate model
                y_pred = self.models[target].predict(X_test_scaled)
                mae = mean_absolute_error(y_test, y_pred)
                r2 = r2_score(y_test, y_pred)
                
                model_scores[target] = {
                    'mae': mae,
                    'r2_score': r2,
                    'accuracy': max(0, r2)  # Convert to accuracy percentage
                }
                
                # Store feature importance
                self.feature_importance[target] = dict(zip(
                    feature_columns,
                    self.models[target].feature_importances_
                ))
                
                logger.info(f"Trained {target} model - R² Score: {r2:.3f}, MAE: {mae:.3f}")
            
            self.historical_accuracy = model_scores
            return model_scores
            
        except Exception as e:
            logger.error(f"Error training models: {e}")
            return {}
    
    async def generate_predictive_forecast(
        self, 
        historical_data: List[Dict], 
        forecast_days: int = 30
    ) -> PredictiveMetrics:
        """Generate predictive forecast for campaign performance"""
        try:
            df = self.prepare_features(historical_data)
            
            if df.empty:
                return self._create_default_forecast(forecast_days)
            
            # Get latest data point for feature generation
            latest_data = df.iloc[-1:].copy()
            
            # Create future features
            future_features = []
            for i in range(1, forecast_days + 1):
                future_date = datetime.now() + timedelta(days=i)
                future_row = latest_data.copy()
                
                # Update time-based features
                future_row['day_of_week'] = future_date.weekday()
                future_row['day_of_month'] = future_date.day
                future_row['month'] = future_date.month
                future_row['quarter'] = (future_date.month - 1) // 3 + 1
                future_row['is_weekend'] = int(future_date.weekday() >= 5)
                future_row['days_since_start'] = latest_data['days_since_start'].iloc[0] + i
                
                future_features.append(future_row)
            
            future_df = pd.concat(future_features, ignore_index=True)
            
            # Select feature columns
            target_columns = ['impressions', 'clicks', 'conversions', 'spend', 'revenue']
            feature_columns = [col for col in future_df.columns if col not in target_columns + ['date', 'campaign_id']]
            
            X_future = future_df[feature_columns]
            
            # Generate predictions
            predictions = {}
            confidence_scores = []
            
            for target in target_columns:
                if target in self.models and target in self.scalers:
                    X_scaled = self.scalers[target].transform(X_future)
                    pred = self.models[target].predict(X_scaled)
                    predictions[target] = pred.sum()  # Sum for forecast period
                    
                    # Calculate confidence based on historical accuracy
                    if target in self.historical_accuracy:
                        confidence_scores.append(self.historical_accuracy[target]['accuracy'])
                else:
                    predictions[target] = 0
            
            # Calculate overall confidence
            avg_confidence = np.mean(confidence_scores) if confidence_scores else 0.5
            
            # Determine trend direction
            recent_trend = self._analyze_trend_direction(df, days=7)
            
            # Calculate seasonal factors
            seasonal_factors = self._calculate_seasonal_factors(df)
            
            # Identify risk factors
            risk_factors = self._identify_risk_factors(df, predictions)
            
            return PredictiveMetrics(
                forecast_period=forecast_days,
                predicted_impressions=predictions.get('impressions', 0),
                predicted_clicks=predictions.get('clicks', 0),
                predicted_conversions=predictions.get('conversions', 0),
                predicted_spend=predictions.get('spend', 0),
                predicted_revenue=predictions.get('revenue', 0),
                confidence_score=avg_confidence,
                trend_direction=recent_trend,
                seasonal_factors=seasonal_factors,
                risk_factors=risk_factors
            )
            
        except Exception as e:
            logger.error(f"Error generating forecast: {e}")
            return self._create_default_forecast(forecast_days)
    
    async def analyze_cross_platform_correlations(
        self, 
        platform_data: Dict[str, List[Dict]]
    ) -> List[CrossPlatformCorrelation]:
        """Analyze correlations between different advertising platforms"""
        try:
            correlations = []
            platforms = list(platform_data.keys())
            
            for i, platform_a in enumerate(platforms):
                for platform_b in platforms[i+1:]:
                    correlation = await self._calculate_platform_correlation(
                        platform_data[platform_a],
                        platform_data[platform_b],
                        platform_a,
                        platform_b
                    )
                    correlations.append(correlation)
            
            return correlations
            
        except Exception as e:
            logger.error(f"Error analyzing correlations: {e}")
            return []
    
    async def _calculate_platform_correlation(
        self,
        data_a: List[Dict],
        data_b: List[Dict],
        platform_a: str,
        platform_b: str
    ) -> CrossPlatformCorrelation:
        """Calculate correlation between two platforms"""
        try:
            df_a = pd.DataFrame(data_a)
            df_b = pd.DataFrame(data_b)
            
            # Align data by date
            df_a['date'] = pd.to_datetime(df_a['date'])
            df_b['date'] = pd.to_datetime(df_b['date'])
            
            merged = pd.merge(df_a, df_b, on='date', suffixes=('_a', '_b'))
            
            if merged.empty:
                return self._create_default_correlation(platform_a, platform_b)
            
            # Calculate correlation for key metrics
            metrics = ['impressions', 'clicks', 'conversions', 'spend']
            correlations = []
            
            for metric in metrics:
                if f'{metric}_a' in merged.columns and f'{metric}_b' in merged.columns:
                    corr = merged[f'{metric}_a'].corr(merged[f'{metric}_b'])
                    if not np.isnan(corr):
                        correlations.append(corr)
            
            avg_correlation = np.mean(correlations) if correlations else 0
            
            # Determine correlation type
            if avg_correlation > 0.3:
                correlation_type = 'positive'
            elif avg_correlation < -0.3:
                correlation_type = 'negative'
            else:
                correlation_type = 'neutral'
            
            # Estimate audience overlap (simplified calculation)
            audience_overlap = min(0.8, abs(avg_correlation))
            
            # Calculate cannibalization risk
            cannibalization_risk = max(0, avg_correlation - 0.5) if avg_correlation > 0 else 0
            
            # Generate optimization opportunity
            if correlation_type == 'positive' and avg_correlation > 0.6:
                opportunity = "High synergy - coordinate campaigns for maximum impact"
            elif correlation_type == 'negative':
                opportunity = "Diversification opportunity - platforms target different audiences"
            elif cannibalization_risk > 0.3:
                opportunity = "Risk of budget cannibalization - optimize budget allocation"
            else:
                opportunity = "Independent performance - maintain current strategy"
            
            return CrossPlatformCorrelation(
                platform_a=platform_a,
                platform_b=platform_b,
                correlation_score=avg_correlation,
                correlation_type=correlation_type,
                shared_audience_overlap=audience_overlap,
                budget_cannibalization_risk=cannibalization_risk,
                optimization_opportunity=opportunity
            )
            
        except Exception as e:
            logger.error(f"Error calculating platform correlation: {e}")
            return self._create_default_correlation(platform_a, platform_b)
    
    async def analyze_performance_trends(
        self, 
        historical_data: List[Dict],
        lookback_days: int = 30
    ) -> List[PerformanceTrend]:
        """Analyze performance trends and detect anomalies"""
        try:
            df = pd.DataFrame(historical_data)
            df['date'] = pd.to_datetime(df['date'])
            df = df.sort_values('date')
            
            # Filter to lookback period
            cutoff_date = datetime.now() - timedelta(days=lookback_days)
            df = df[df['date'] >= cutoff_date]
            
            trends = []
            metrics = ['impressions', 'clicks', 'conversions', 'spend', 'revenue', 'ctr', 'cpc', 'conversion_rate', 'roas']
            
            for metric in metrics:
                if metric not in df.columns:
                    continue
                
                trend = await self._analyze_metric_trend(df, metric)
                trends.append(trend)
            
            return trends
            
        except Exception as e:
            logger.error(f"Error analyzing trends: {e}")
            return []
    
    async def _analyze_metric_trend(self, df: pd.DataFrame, metric: str) -> PerformanceTrend:
        """Analyze trend for a specific metric"""
        try:
            values = df[metric].values
            current_value = values[-1] if len(values) > 0 else 0
            
            # Calculate trend direction and strength
            if len(values) >= 7:
                recent_values = values[-7:]
                trend_slope = np.polyfit(range(len(recent_values)), recent_values, 1)[0]
                
                # Normalize trend strength
                value_std = np.std(values) if len(values) > 1 else 1
                trend_strength = min(1.0, abs(trend_slope) / (value_std + 0.001))
                
                if trend_slope > 0.05 * np.mean(values):
                    trend_direction = 'up'
                elif trend_slope < -0.05 * np.mean(values):
                    trend_direction = 'down'
                else:
                    trend_direction = 'stable'
            else:
                trend_direction = 'stable'
                trend_strength = 0.0
            
            # Calculate period changes
            weekly_change = 0
            monthly_change = 0
            
            if len(values) >= 7:
                weekly_change = (values[-1] - values[-7]) / (values[-7] + 0.001) * 100
            
            if len(values) >= 30:
                monthly_change = (values[-1] - values[-30]) / (values[-30] + 0.001) * 100
            
            # Detect anomalies
            anomaly_detected = False
            anomaly_severity = 'low'
            
            if len(values) >= 14:
                recent_mean = np.mean(values[-7:])
                historical_mean = np.mean(values[:-7])
                historical_std = np.std(values[:-7])
                
                if historical_std > 0:
                    z_score = abs(recent_mean - historical_mean) / historical_std
                    if z_score > 3:
                        anomaly_detected = True
                        anomaly_severity = 'high'
                    elif z_score > 2:
                        anomaly_detected = True
                        anomaly_severity = 'medium'
            
            # Calculate seasonal patterns (simplified)
            seasonal_pattern = self._calculate_seasonal_pattern(df, metric)
            
            return PerformanceTrend(
                metric_name=metric,
                current_value=current_value,
                trend_direction=trend_direction,
                trend_strength=trend_strength,
                weekly_change=weekly_change,
                monthly_change=monthly_change,
                seasonal_pattern=seasonal_pattern,
                anomaly_detected=anomaly_detected,
                anomaly_severity=anomaly_severity
            )
            
        except Exception as e:
            logger.error(f"Error analyzing trend for {metric}: {e}")
            return PerformanceTrend(
                metric_name=metric,
                current_value=0,
                trend_direction='stable',
                trend_strength=0,
                weekly_change=0,
                monthly_change=0,
                seasonal_pattern={},
                anomaly_detected=False,
                anomaly_severity='low'
            )
    
    async def generate_ai_insights(
        self,
        performance_data: List[Dict],
        trends: List[PerformanceTrend],
        correlations: List[CrossPlatformCorrelation],
        forecast: PredictiveMetrics
    ) -> List[AIInsight]:
        """Generate AI-powered insights and recommendations"""
        try:
            insights = []
            
            # Performance insights
            insights.extend(await self._generate_performance_insights(performance_data, trends))
            
            # Trend insights
            insights.extend(await self._generate_trend_insights(trends))
            
            # Cross-platform insights
            insights.extend(await self._generate_correlation_insights(correlations))
            
            # Predictive insights
            insights.extend(await self._generate_predictive_insights(forecast))
            
            # Sort by impact score and priority
            insights.sort(key=lambda x: (self._priority_score(x.priority), -x.impact_score), reverse=True)
            
            return insights[:10]  # Return top 10 insights
            
        except Exception as e:
            logger.error(f"Error generating insights: {e}")
            return []
    
    async def _generate_performance_insights(
        self, 
        performance_data: List[Dict], 
        trends: List[PerformanceTrend]
    ) -> List[AIInsight]:
        """Generate insights based on current performance"""
        insights = []
        
        try:
            df = pd.DataFrame(performance_data)
            
            # Calculate current metrics
            total_spend = df['spend'].sum() if 'spend' in df.columns else 0
            total_revenue = df['revenue'].sum() if 'revenue' in df.columns else 0
            overall_roas = total_revenue / total_spend if total_spend > 0 else 0
            
            # High ROAS insight
            if overall_roas > 4.0:
                insights.append(AIInsight(
                    insight_type='performance',
                    confidence=0.9,
                    impact_score=85,
                    title='Exceptional ROAS Performance',
                    description=f'Current ROAS of {overall_roas:.1f}x significantly exceeds industry benchmarks.',
                    recommendation='Scale successful campaigns and replicate winning strategies across other campaigns.',
                    priority='high',
                    estimated_impact={'revenue_increase': 25, 'efficiency_gain': 15},
                    implementation_effort='medium'
                ))
            
            # Low ROAS warning
            elif overall_roas < 1.5:
                insights.append(AIInsight(
                    insight_type='performance',
                    confidence=0.85,
                    impact_score=90,
                    title='ROAS Below Target',
                    description=f'Current ROAS of {overall_roas:.1f}x is below profitable levels.',
                    recommendation='Immediately review targeting, ad creative, and bidding strategies. Consider pausing underperforming campaigns.',
                    priority='critical',
                    estimated_impact={'cost_reduction': 30, 'efficiency_gain': 40},
                    implementation_effort='high'
                ))
            
            # Anomaly insights
            for trend in trends:
                if trend.anomaly_detected and trend.anomaly_severity == 'high':
                    insights.append(AIInsight(
                        insight_type='anomaly',
                        confidence=0.8,
                        impact_score=75,
                        title=f'Anomaly Detected in {trend.metric_name.title()}',
                        description=f'Unusual pattern detected in {trend.metric_name} performance.',
                        recommendation=f'Investigate recent changes in {trend.metric_name} and adjust strategy accordingly.',
                        priority='medium',
                        estimated_impact={'risk_mitigation': 50},
                        implementation_effort='low'
                    ))
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating performance insights: {e}")
            return []
    
    def _priority_score(self, priority: str) -> int:
        """Convert priority to numeric score for sorting"""
        priority_map = {'critical': 4, 'high': 3, 'medium': 2, 'low': 1}
        return priority_map.get(priority, 1)
    
    def _analyze_trend_direction(self, df: pd.DataFrame, days: int = 7) -> str:
        """Analyze overall trend direction"""
        try:
            if len(df) < days:
                return 'stable'
            
            recent_data = df.tail(days)
            revenue_trend = recent_data['revenue'].values if 'revenue' in recent_data.columns else recent_data['clicks'].values
            
            if len(revenue_trend) >= 2:
                slope = np.polyfit(range(len(revenue_trend)), revenue_trend, 1)[0]
                if slope > 0.05 * np.mean(revenue_trend):
                    return 'up'
                elif slope < -0.05 * np.mean(revenue_trend):
                    return 'down'
            
            return 'stable'
            
        except Exception:
            return 'stable'
    
    def _calculate_seasonal_factors(self, df: pd.DataFrame) -> Dict[str, float]:
        """Calculate seasonal performance factors"""
        try:
            seasonal_factors = {}
            
            if 'date' in df.columns and len(df) >= 30:
                df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
                df['hour'] = pd.to_datetime(df['date']).dt.hour
                
                # Day of week patterns
                if 'revenue' in df.columns:
                    daily_performance = df.groupby('day_of_week')['revenue'].mean()
                    seasonal_factors['weekday_performance'] = daily_performance.to_dict()
                
                # Hour patterns (if hourly data available)
                if len(df) >= 168:  # At least a week of hourly data
                    hourly_performance = df.groupby('hour')['revenue'].mean()
                    seasonal_factors['hourly_performance'] = hourly_performance.to_dict()
            
            return seasonal_factors
            
        except Exception:
            return {}
    
    def _identify_risk_factors(self, df: pd.DataFrame, predictions: Dict) -> List[str]:
        """Identify potential risk factors"""
        risks = []
        
        try:
            # Check for declining trends
            if len(df) >= 7:
                recent_revenue = df['revenue'].tail(7).mean() if 'revenue' in df.columns else 0
                older_revenue = df['revenue'].head(7).mean() if 'revenue' in df.columns else 0
                
                if recent_revenue < older_revenue * 0.8:
                    risks.append("Revenue declining trend detected")
            
            # Check for high spend without proportional returns
            if 'spend' in df.columns and 'revenue' in df.columns:
                recent_roas = df['revenue'].sum() / df['spend'].sum() if df['spend'].sum() > 0 else 0
                if recent_roas < 2.0:
                    risks.append("Low ROAS indicates inefficient spending")
            
            # Check prediction confidence
            if predictions.get('predicted_revenue', 0) < df['revenue'].tail(7).mean() if 'revenue' in df.columns else 0:
                risks.append("Predictive model indicates potential performance decline")
            
            return risks
            
        except Exception:
            return []
    
    def _calculate_seasonal_pattern(self, df: pd.DataFrame, metric: str) -> Dict[str, float]:
        """Calculate seasonal pattern for a specific metric"""
        try:
            if len(df) < 7:
                return {}
            
            df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
            daily_pattern = df.groupby('day_of_week')[metric].mean().to_dict()
            
            return daily_pattern
            
        except Exception:
            return {}
    
    def _create_default_forecast(self, forecast_days: int) -> PredictiveMetrics:
        """Create default forecast when data is insufficient"""
        return PredictiveMetrics(
            forecast_period=forecast_days,
            predicted_impressions=0,
            predicted_clicks=0,
            predicted_conversions=0,
            predicted_spend=0,
            predicted_revenue=0,
            confidence_score=0.1,
            trend_direction='stable',
            seasonal_factors={},
            risk_factors=['Insufficient historical data for accurate predictions']
        )
    
    def _create_default_correlation(self, platform_a: str, platform_b: str) -> CrossPlatformCorrelation:
        """Create default correlation when data is insufficient"""
        return CrossPlatformCorrelation(
            platform_a=platform_a,
            platform_b=platform_b,
            correlation_score=0.0,
            correlation_type='neutral',
            shared_audience_overlap=0.0,
            budget_cannibalization_risk=0.0,
            optimization_opportunity='Insufficient data for correlation analysis'
        )
    
    # Additional insight generation methods would continue here...
    async def _generate_trend_insights(self, trends: List[PerformanceTrend]) -> List[AIInsight]:
        """Generate insights based on performance trends"""
        insights = []
        
        try:
            for trend in trends:
                if trend.trend_direction == 'up' and trend.trend_strength > 0.7:
                    insights.append(AIInsight(
                        insight_type='trend',
                        confidence=0.8,
                        impact_score=70,
                        title=f'Strong Upward Trend in {trend.metric_name.title()}',
                        description=f'{trend.metric_name.title()} showing strong positive trend with {trend.weekly_change:.1f}% weekly growth.',
                        recommendation=f'Capitalize on {trend.metric_name} momentum by increasing budget allocation.',
                        priority='medium',
                        estimated_impact={'growth_acceleration': 20},
                        implementation_effort='low'
                    ))
                
                elif trend.trend_direction == 'down' and trend.trend_strength > 0.6:
                    insights.append(AIInsight(
                        insight_type='trend',
                        confidence=0.85,
                        impact_score=80,
                        title=f'Declining {trend.metric_name.title()} Performance',
                        description=f'{trend.metric_name.title()} declining by {abs(trend.weekly_change):.1f}% weekly.',
                        recommendation=f'Immediate action needed to reverse {trend.metric_name} decline.',
                        priority='high',
                        estimated_impact={'loss_prevention': 35},
                        implementation_effort='medium'
                    ))
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating trend insights: {e}")
            return []
    
    async def _generate_correlation_insights(self, correlations: List[CrossPlatformCorrelation]) -> List[AIInsight]:
        """Generate insights based on cross-platform correlations"""
        insights = []
        
        try:
            for corr in correlations:
                if corr.budget_cannibalization_risk > 0.4:
                    insights.append(AIInsight(
                        insight_type='correlation',
                        confidence=0.75,
                        impact_score=65,
                        title=f'Budget Cannibalization Risk: {corr.platform_a} vs {corr.platform_b}',
                        description=f'High correlation ({corr.correlation_score:.2f}) suggests potential budget overlap.',
                        recommendation='Optimize budget allocation to reduce cannibalization and improve overall efficiency.',
                        priority='medium',
                        estimated_impact={'efficiency_gain': 25, 'cost_reduction': 15},
                        implementation_effort='medium'
                    ))
                
                elif corr.correlation_score > 0.7:
                    insights.append(AIInsight(
                        insight_type='correlation',
                        confidence=0.8,
                        impact_score=60,
                        title=f'High Synergy: {corr.platform_a} & {corr.platform_b}',
                        description=f'Strong positive correlation indicates complementary performance.',
                        recommendation='Coordinate campaigns across platforms for maximum synergistic impact.',
                        priority='medium',
                        estimated_impact={'synergy_gain': 30},
                        implementation_effort='low'
                    ))
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating correlation insights: {e}")
            return []
    
    async def _generate_predictive_insights(self, forecast: PredictiveMetrics) -> List[AIInsight]:
        """Generate insights based on predictive forecasts"""
        insights = []
        
        try:
            if forecast.confidence_score > 0.7:
                if forecast.trend_direction == 'up':
                    insights.append(AIInsight(
                        insight_type='prediction',
                        confidence=forecast.confidence_score,
                        impact_score=75,
                        title='Positive Performance Forecast',
                        description=f'Model predicts {forecast.trend_direction} trend with {forecast.confidence_score:.1%} confidence.',
                        recommendation='Prepare to scale successful strategies based on predicted growth.',
                        priority='medium',
                        estimated_impact={'future_revenue': forecast.predicted_revenue},
                        implementation_effort='low'
                    ))
                
                elif forecast.trend_direction == 'down':
                    insights.append(AIInsight(
                        insight_type='prediction',
                        confidence=forecast.confidence_score,
                        impact_score=85,
                        title='Performance Decline Predicted',
                        description=f'Model forecasts declining performance with {forecast.confidence_score:.1%} confidence.',
                        recommendation='Implement preventive measures to mitigate predicted performance decline.',
                        priority='high',
                        estimated_impact={'risk_mitigation': 40},
                        implementation_effort='medium'
                    ))
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating predictive insights: {e}")
            return []

# Export the main class
__all__ = ['AdvancedAnalyticsEngine', 'PredictiveMetrics', 'CrossPlatformCorrelation', 'PerformanceTrend', 'AIInsight']