'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Package,
  Warehouse,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Tag,
  Calendar,
  MapPin,
  Truck,
  Clock,
  DollarSign,
  Boxes,
  Archive,
  ArrowUpDown,
  Grid,
  List,
  ScanLine,
  QrCode
} from 'lucide-react';

// SSR-safe imports for universal sidebar system
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const NavigationTabs = dynamic(() => import('@/components/NavigationTabs'), {
  ssr: false,
  loading: () => <div className="h-12 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

// Inventory Types
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  cost: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  location: string;
  supplier: string;
  lastOrdered: string;
  barcode: string;
  weight: number;
  dimensions: string;
  tags: string[];
}

interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reason: string;
  date: string;
  reference: string;
  location: string;
  user: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  leadTime: number;
  status: 'active' | 'inactive';
}

interface InventoryAlert {
  id: string;
  type: 'low-stock' | 'out-of-stock' | 'overstock' | 'expiry';
  productId: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  resolved: boolean;
}

export default function InventoryManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'movements' | 'suppliers' | 'alerts'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data - will be replaced with real API calls in Phase 3
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod-001',
      name: 'Premium Wireless Headphones',
      sku: 'WH-PRE-001',
      category: 'Electronics',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      cost: 150.00,
      quantity: 45,
      minStock: 10,
      maxStock: 100,
      status: 'in-stock',
      location: 'Warehouse A - Section 1',
      supplier: 'TechCorp Ltd',
      lastOrdered: '2025-09-15',
      barcode: '123456789012',
      weight: 0.8,
      dimensions: '20x15x8 cm',
      tags: ['electronics', 'wireless', 'premium']
    },
    {
      id: 'prod-002',
      name: 'Ergonomic Office Chair',
      sku: 'CH-ERG-002',
      category: 'Furniture',
      description: 'Comfortable ergonomic office chair with lumbar support',
      price: 249.99,
      cost: 120.00,
      quantity: 8,
      minStock: 15,
      maxStock: 50,
      status: 'low-stock',
      location: 'Warehouse B - Section 3',
      supplier: 'FurniCorp Inc',
      lastOrdered: '2025-08-28',
      barcode: '123456789013',
      weight: 18.5,
      dimensions: '65x65x120 cm',
      tags: ['furniture', 'office', 'ergonomic']
    },
    {
      id: 'prod-003',
      name: 'Smart Water Bottle',
      sku: 'WB-SMT-003',
      category: 'Lifestyle',
      description: 'Temperature-tracking smart water bottle with app integration',
      price: 79.99,
      cost: 35.00,
      quantity: 0,
      minStock: 20,
      maxStock: 100,
      status: 'out-of-stock',
      location: 'Warehouse A - Section 2',
      supplier: 'LifeStyle Co',
      lastOrdered: '2025-09-01',
      barcode: '123456789014',
      weight: 0.6,
      dimensions: '8x8x25 cm',
      tags: ['lifestyle', 'smart', 'health']
    },
    {
      id: 'prod-004',
      name: 'Gaming Mechanical Keyboard',
      sku: 'KB-GAM-004',
      category: 'Electronics',
      description: 'RGB gaming mechanical keyboard with custom switches',
      price: 159.99,
      cost: 80.00,
      quantity: 32,
      minStock: 15,
      maxStock: 75,
      status: 'in-stock',
      location: 'Warehouse A - Section 1',
      supplier: 'TechCorp Ltd',
      lastOrdered: '2025-09-20',
      barcode: '123456789015',
      weight: 1.2,
      dimensions: '45x15x4 cm',
      tags: ['electronics', 'gaming', 'rgb']
    }
  ]);

  const [movements, setMovements] = useState<StockMovement[]>([
    {
      id: 'mov-001',
      productId: 'prod-001',
      type: 'in',
      quantity: 25,
      reason: 'Purchase order #PO-2025-045',
      date: '2025-09-28',
      reference: 'PO-2025-045',
      location: 'Warehouse A',
      user: 'John Smith'
    },
    {
      id: 'mov-002',
      productId: 'prod-002',
      type: 'out',
      quantity: 3,
      reason: 'Sales order #SO-2025-156',
      date: '2025-09-29',
      reference: 'SO-2025-156',
      location: 'Warehouse B',
      user: 'Sarah Johnson'
    },
    {
      id: 'mov-003',
      productId: 'prod-003',
      type: 'out',
      quantity: 5,
      reason: 'Sales order #SO-2025-157',
      date: '2025-09-30',
      reference: 'SO-2025-157',
      location: 'Warehouse A',
      user: 'Mike Davis'
    }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 'sup-001',
      name: 'TechCorp Ltd',
      contact: 'James Wilson',
      email: 'orders@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, Silicon Valley, CA',
      rating: 4.8,
      leadTime: 7,
      status: 'active'
    },
    {
      id: 'sup-002',
      name: 'FurniCorp Inc',
      contact: 'Lisa Anderson',
      email: 'supply@furnicorp.com',
      phone: '+1 (555) 987-6543',
      address: '456 Furniture Ave, Dallas, TX',
      rating: 4.5,
      leadTime: 14,
      status: 'active'
    },
    {
      id: 'sup-003',
      name: 'LifeStyle Co',
      contact: 'Robert Chen',
      email: 'orders@lifestyle.com',
      phone: '+1 (555) 456-7890',
      address: '789 Lifestyle Blvd, Los Angeles, CA',
      rating: 4.2,
      leadTime: 10,
      status: 'active'
    }
  ]);

  const [alerts, setAlerts] = useState<InventoryAlert[]>([
    {
      id: 'alert-001',
      type: 'low-stock',
      productId: 'prod-002',
      message: 'Ergonomic Office Chair is running low (8 units remaining)',
      priority: 'high',
      timestamp: '2025-09-30T10:30:00Z',
      resolved: false
    },
    {
      id: 'alert-002',
      type: 'out-of-stock',
      productId: 'prod-003',
      message: 'Smart Water Bottle is out of stock',
      priority: 'high',
      timestamp: '2025-09-30T09:45:00Z',
      resolved: false
    }
  ]);

  // Inventory Analytics
  const analytics = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.quantity * p.cost), 0),
    inStockProducts: products.filter(p => p.status === 'in-stock').length,
    lowStockProducts: products.filter(p => p.status === 'low-stock').length,
    outOfStockProducts: products.filter(p => p.status === 'out-of-stock').length,
    totalMovements: movements.length,
    activeAlerts: alerts.filter(a => !a.resolved).length
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'in-stock': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
      'low-stock': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300',
      'out-of-stock': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300',
      'discontinued': 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[status] || colors['in-stock'];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'in-stock': CheckCircle,
      'low-stock': AlertTriangle,
      'out-of-stock': XCircle,
      'discontinued': Archive
    };
    const Icon = icons[status] || CheckCircle;
    return <Icon className="w-4 h-4" />;
  };

  const getMovementTypeIcon = (type: string) => {
    const icons = {
      'in': TrendingUp,
      'out': TrendingDown,
      'adjustment': Settings,
      'transfer': ArrowUpDown
    };
    const Icon = icons[type] || Package;
    return <Icon className="w-4 h-4" />;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalProducts}</p>
              <p className="text-sm text-blue-600">{analytics.inStockProducts} in stock</p>
            </div>
            <Package className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inventory Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${analytics.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">+2.5% this month</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.lowStockProducts}</p>
              {analytics.outOfStockProducts > 0 && (
                <p className="text-sm text-red-600">{analytics.outOfStockProducts} out of stock</p>
              )}
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.activeAlerts}</p>
              <p className="text-sm text-orange-600">Needs attention</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Inventory Status & Recent Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Status Distribution</h3>
          <div className="space-y-4">
            {[
              { status: 'in-stock', count: analytics.inStockProducts, label: 'In Stock', color: 'green' },
              { status: 'low-stock', count: analytics.lowStockProducts, label: 'Low Stock', color: 'yellow' },
              { status: 'out-of-stock', count: analytics.outOfStockProducts, label: 'Out of Stock', color: 'red' }
            ].map((item) => {
              const percentage = analytics.totalProducts > 0 ? (item.count / analytics.totalProducts) * 100 : 0;
              return (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-${item.color}-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Stock Movements</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {movements.slice(0, 5).map((movement) => {
              const product = products.find(p => p.id === movement.productId);
              return (
                <div key={movement.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className={`p-1 rounded-full ${
                    movement.type === 'in' ? 'bg-green-100 dark:bg-green-900/30' :
                    movement.type === 'out' ? 'bg-red-100 dark:bg-red-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {getMovementTypeIcon(movement.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {product?.name || 'Unknown Product'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {movement.type === 'in' ? '+' : '-'}{movement.quantity} units • {movement.reason}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(movement.date).toLocaleDateString()} by {movement.user}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {alerts.filter(a => !a.resolved).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {alerts.filter(a => !a.resolved).map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.priority === 'high' ? 'text-red-600' :
                      alert.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{alert.message}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProductsTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Products ({filteredProducts.length})
          </h2>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1).replace('-', ' ')}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">SKU: {product.sku}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{product.category}</p>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Stock:</span>
                      <span className={`text-sm font-medium ${
                        product.quantity <= product.minStock ? 'text-red-600' : 'text-gray-900 dark:text-white'
                      }`}>
                        {product.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Price:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                      Edit
                    </button>
                    <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-600">
                      View
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">SKU: {product.sku} • {product.category}</p>
                      <p className="text-sm text-gray-500">{product.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Stock</p>
                      <p className={`font-semibold ${
                        product.quantity <= product.minStock ? 'text-red-600' : 'text-gray-900 dark:text-white'
                      }`}>
                        {product.quantity}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                      <p className="font-semibold text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Value</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${(product.quantity * product.cost).toFixed(2)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1).replace('-', ' ')}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      }`}>
        {/* Advanced Navigation */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Navigation Tabs */}
        <NavigationTabs />
        
        {/* Inventory Management Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white">
                <Warehouse className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Inventory Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track stock levels, manage products, and monitor inventory movements
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'products', label: 'Products', icon: Package },
                { key: 'movements', label: 'Movements', icon: ArrowUpDown },
                { key: 'suppliers', label: 'Suppliers', icon: Truck },
                { key: 'alerts', label: 'Alerts', icon: AlertTriangle }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.key === 'alerts' && analytics.activeAlerts > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {analytics.activeAlerts}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'products' && renderProductsTab()}
              {activeTab === 'movements' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <ArrowUpDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Stock movements interface coming soon</p>
                </div>
              )}
              {activeTab === 'suppliers' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Supplier management interface coming soon</p>
                </div>
              )}
              {activeTab === 'alerts' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Alert management interface coming soon</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}