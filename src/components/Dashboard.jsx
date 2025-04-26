import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Tabs,
  Tab,
  IconButton, // Import IconButton
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react'; // Import the X icon for the close button

// Sample data
const cloudAccountsData = [
  { name: 'Connected', value: 2, display: '2 Connected (2)' },
  { name: 'Not Connected', value: 2, display: 'Not Connected (2)' },
];

const cloudRiskData = [
  { name: 'Failed', value: 1688, display: 'Failed (1688)' },
  { name: 'Warning', value: 681, display: 'Warning (681)' },
  { name: 'Not Available', value: 36, display: 'Not available (36)' },
  { name: 'Passed', value: 7253, display: 'Passed (7253)' },
];

const namespaceAlertsData = [
  { name: 'Alert 1', value: 10 },
  { name: 'Alert 2', value: 5 },
  { name: 'Alert 3', value: 2 },
];

const workloadAlertsData = [
  { name: 'Workload A', value: 20 },
  { name: 'Workload B', value: 12 },
];

const imageRiskData = [
  { name: 'Critical', value: 9, display: 'Critical (9)' },
  { name: 'High', value: 160, display: 'High (160)' },
  { name: 'Medium', value: 1470 - 9 - 160, display: `Medium (${1470 - 9 - 160})` },
];

const imageSecurityData = [
  { name: 'Critical', value: 2, display: 'Critical (2)' },
  { name: 'High', value: 3, display: 'High (3)' },
  { name: 'Total', value: 2, display: '2 Total Images' }, // Added for total
];

const WIDGET_CATEGORIES = [
  { label: 'CSPM', value: 'cspm' },
  { label: 'CWPP', value: 'cwpp' },
  { label: 'Image', value: 'image' },
  { label: 'Ticket', value: 'ticket' },
];

const ALL_WIDGETS = [
  { category: 'cspm', label: 'Cloud Accounts', value: 'cloudAccounts' },
  { category: 'cspm', label: 'Cloud Account Risk Assessment', value: 'cloudRisk' },
  { category: 'cwpp', label: 'Top 5 Namespace Specific Alerts', value: 'namespaceAlerts' },
  { category: 'cwpp', label: 'Workload Alerts', value: 'workloadAlerts' },
  { category: 'image', label: 'Image Risk Assessment', value: 'imageRisk' },
  { category: 'image', label: 'Image Security Issues', value: 'imageSecurity' },
];

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F', '#FF0000'];

const WidgetCard = ({ title, children, cardWidth, cardHeight, onDeleteWidget }) => (
  <Grid item xs={12} md={4} lg={4} sx={{ width: cardWidth, height: cardHeight, position: 'relative' }}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        <Typography variant="subtitle1" mb={2}>{title}</Typography>
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        {onDeleteWidget && (
          <Button
            variant="outlined"
            size="small"
            onClick={onDeleteWidget}
            sx={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}
          >
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  </Grid>
);

const EmptyWidget = ({ cardWidth, cardHeight, onAddWidget }) => (
  <Grid item xs={12} md={4} lg={4} sx={{ width: cardWidth, height: cardHeight }}>
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="outlined" fullWidth onClick={onAddWidget}>Add Widget</Button>
      </CardContent>
    </Card>
  </Grid>
);

const NoDataWidget = ({ title, cardWidth, cardHeight }) => (
  <Grid item xs={12} md={4} lg={4} sx={{ width: cardWidth, height: cardHeight }}>
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="subtitle1" mb={2}>{title}</Typography>
        <Box height={200} display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
          No Graph data available!
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

const Dashboard = () => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedWidgets, setSelectedWidgets] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedWidgets');
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Error parsing selectedWidgets from localStorage", e);
        return [];
      }
    }
    return [];
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('cspm');
  const containerRef = useRef(null);
  const [newWidgetName, setNewWidgetName] = useState('');
  const [newWidgetText, setNewWidgetText] = useState('');
  const [isAddingNewWidget, setIsAddingNewWidget] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedWidgets', JSON.stringify(selectedWidgets));
    }
  }, [selectedWidgets]);

  const cardWidth = screenWidth ? `${screenWidth / 3.3}px` : '290px';
  const cardHeight = screenHeight ? `${screenHeight / 3.3}px` : '190px';

  const handleAddWidget = () => {
    setIsDrawerOpen(true);
    setIsAddingNewWidget(false); // Ensure new widget form is not open
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCategory('cspm'); // Reset to the first category when the drawer closes
    setIsAddingNewWidget(false);
    setNewWidgetName('');
    setNewWidgetText('');
  };

  const handleWidgetSelect = (event, widgetValue) => {
    if (event.target.checked) {
      setSelectedWidgets([...selectedWidgets, widgetValue]);
    } else {
      setSelectedWidgets(selectedWidgets.filter(value => value !== widgetValue));
    }
  };

  const handleConfirmWidgets = () => {
    setIsDrawerOpen(false); // Close the drawer after confirmation
    setIsAddingNewWidget(false);
    setNewWidgetName('');
    setNewWidgetText('');
  };

  const handleCategoryChange = useCallback((value) => {
    setSelectedCategory(value);
    if (containerRef.current) {
      const categoryElement = document.getElementById(value);
      if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  const handleAddNewWidget = () => {
    if (newWidgetName.trim() && newWidgetText.trim()) {
      const newWidget = {
        id: uuidv4(),
        category: selectedCategory || 'cspm', // Default to 'cspm' if no category
        label: newWidgetName,
        text: newWidgetText,
        type: 'custom', // Add a type to distinguish custom widgets
      };
      setSelectedWidgets([...selectedWidgets, newWidget.id]);

      // Add to ALL_WIDGETS for display in the form.
      ALL_WIDGETS.push({
        category: selectedCategory || 'cspm',
        label: newWidgetName,
        value: newWidget.id,
        type: 'custom'
      });

      // Update localStorage
      localStorage.setItem('selectedWidgets', JSON.stringify([...selectedWidgets, newWidget.id]));

      // Add new widget to local state for rendering
      setNewWidgetName('');
      setNewWidgetText('');
      setIsAddingNewWidget(false); // Close the form
    }
  };

  const handleDeleteWidget = (widgetId) => {
    setSelectedWidgets(selectedWidgets.filter(id => id !== widgetId));
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedWidgets');
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.filter(id => id !== widgetId);
        localStorage.setItem('selectedWidgets', JSON.stringify(updated));
      }
    }
  };

  const renderWidget = (widgetId) => {
    const widget = ALL_WIDGETS.find((w) => w.value === widgetId);

    if (!widget) {
      return <></>;
    }

    if (widget.type === 'custom') {
      return (
        <WidgetCard
          key={widget.value}
          title={widget.label}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          onDeleteWidget={() => handleDeleteWidget(widget.value)}
        >
          <Typography variant="body1">{newWidgetText}</Typography>
        </WidgetCard>
      );
    }

    switch (widget.value) {
      case 'cloudAccounts':
        return (
          <WidgetCard
            key={widget.value}
            title="Cloud Accounts"
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            onDeleteWidget={() => handleDeleteWidget(widget.value)}
          >
            <ResponsiveContainer width="100%" height={190}>
              <PieChart data={cloudAccountsData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" >
                <Pie data={cloudAccountsData} label>
                  {cloudAccountsData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend formatter={(value) => {
                  const data = cloudAccountsData.find(item => item.name === value);
                  return data ? data.display : value;
                }} />
              </PieChart>
            </ResponsiveContainer>
            <Typography variant="body2" color="text.secondary" align="center" mt={2}>
              {cloudAccountsData.map((item) => item.display).join(' | ')}
            </Typography>
          </WidgetCard>
        );
      case 'cloudRisk':
        return (
          <WidgetCard
            key={widget.value}
            title="Cloud Account Risk Assessment"
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            onDeleteWidget={() => handleDeleteWidget(widget.value)}
          >
            <ResponsiveContainer width="100%" height={190}>
              <PieChart data={cloudRiskData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value" >
                <Pie data={cloudRiskData} label>
                  {cloudRiskData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend formatter={(value) => {
                  const data = cloudRiskData.find(item => item.name === value);
                  return data ? data.display : value;
                }} />
              </PieChart>
            </ResponsiveContainer>
            <Typography variant="body2" color="text.secondary" align="center" mt={2}>
              {cloudRiskData.map((item) => item.display).join(' | ')}
            </Typography>
          </WidgetCard>
        );
      case 'namespaceAlerts':
        return (
          <WidgetCard
            key={widget.value}
            title="Top 5 Namespace Specific Alerts"
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            onDeleteWidget={() => handleDeleteWidget(widget.value)}
          >
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={namespaceAlertsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFC107" />
              </BarChart>
            </ResponsiveContainer>
          </WidgetCard>
        );
      case 'workloadAlerts':
        return (
          <WidgetCard
            key={widget.value}
            title="Workload Alerts"
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            onDeleteWidget={() => handleDeleteWidget(widget.value)}
          >
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={workloadAlertsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF5252" />
              </BarChart>
            </ResponsiveContainer>
          </WidgetCard>
        );
      case 'imageRisk':
        return (
          <WidgetCard
            key={widget.value}
            title="Image Risk Assessment"
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            onDeleteWidget={() => handleDeleteWidget(widget.value)}
          >
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={imageRiskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF8042" />
                <Legend formatter={(value) => {
                  const data = imageRiskData.find(item => item.name === value);
                  return data ? data.display : value;
                }} />
              </BarChart>
            </ResponsiveContainer>
            <Typography variant="body2" color="text.secondary" align="center" mt={2}>
              {imageRiskData.map((item) => item.display).join(' | ')}
            </Typography>
          </WidgetCard>
        );
      case 'imageSecurity':
        return (
          <WidgetCard
            key={widget.value}
            title="Image Security Issues"
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            onDeleteWidget={() => handleDeleteWidget(widget.value)}
          >
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={imageSecurityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF0000" />
                <Legend formatter={(value) => {
                  const data = imageSecurityData.find(item => item.name === value);
                  return data ? data.display : value;
                }} />
              </BarChart>
            </ResponsiveContainer>
            <Typography variant="body2" color="text.secondary" align="center" mt={2}>
              {imageSecurityData.map((item) => item.display).join(' | ')}
            </Typography>
          </WidgetCard>
        );
      default:
        return null;
    }
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">CNAPP Dashboard</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small">
            <Select defaultValue="2days">
              <MenuItem value="1day">Last 1 day</MenuItem>
              <MenuItem value="2days">Last 2 days</MenuItem>
              <MenuItem value="7days">Last 7 days</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddWidget}>Add Widget</Button>
        </Box>
      </Box>

      {/* Render Widgets */}
      <div ref={containerRef}>
        <section id="cspm">
          <Typography variant="h6" mb={1}>CSPM Executive Dashboard</Typography>
          <Grid container spacing={2} mb={4}>
            {selectedWidgets.filter(id => ALL_WIDGETS.find(w => w.value === id)?.category === 'cspm').map(widgetId => (
              renderWidget(widgetId)
            ))}
            <EmptyWidget cardWidth={cardWidth} cardHeight={cardHeight} onAddWidget={handleAddWidget} />
          </Grid>
        </section>
      </div>

      <div ref={containerRef}>
        <section id="cwpp">
          <Typography variant="h6" mb={1}>CWPP Dashboard</Typography>
          <Grid container spacing={2} mb={4}>
            {selectedWidgets.filter(id => ALL_WIDGETS.find(w => w.value === id)?.category === 'cwpp').map(widgetId => (
              renderWidget(widgetId)
            ))}
            <EmptyWidget cardWidth={cardWidth} cardHeight={cardHeight} onAddWidget={handleAddWidget} />
          </Grid>
        </section>
      </div>

      <div ref={containerRef}>
        <section id="image">
          <Typography variant="h6" mb={1}>Registry Scan</Typography>
          <Grid container spacing={2}>
            {selectedWidgets.filter(id => ALL_WIDGETS.find(w => w.value === id)?.category === 'image').map(widgetId => (
              renderWidget(widgetId)
            ))}
            <EmptyWidget cardWidth={cardWidth} cardHeight={cardHeight} onAddWidget={handleAddWidget} />
          </Grid>
        </section>
      </div>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: 400 }, // Increased width of the drawer
        }}
      >
        <Box sx={{ width: 400 }}>
          {/* Custom Title Bar */}
          <Box
            sx={{
              backgroundColor: '#003366', // Dark blue background
              color: 'white',
              padding: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white' }}>
              Add Widget
            </Typography>
            <IconButton onClick={handleCloseDrawer} sx={{ color: 'white' }}>
              <X size={20} /> {/* Use the X icon here */}
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            <Typography variant="body1" mb={2}>
              Personalize your dashboard by adding the following widget
            </Typography>
            <Tabs
              value={selectedCategory || 'cspm'}
              onChange={(event, newValue) => handleCategoryChange(newValue)}
              aria-label="widget categories"
              sx={{ mb: 2 }}
            >
              {WIDGET_CATEGORIES.map((category) => (
                <Tab key={category.value} value={category.value} label={category.label} />
              ))}
            </Tabs>
            <Grid container spacing={2}>
              {WIDGET_CATEGORIES.map((category) => (
                <Grid item xs={6} key={category.value} style={{ display: selectedCategory === category.value ? 'block' : 'none' }}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>{category.label}</Typography>
                  <FormGroup>
                    {ALL_WIDGETS.filter(widget => widget.category === category.value && widget.type !== 'custom').map((widget) => (
                      <FormControlLabel
                        key={widget.value}
                        control={
                          <Checkbox
                            checked={selectedWidgets.includes(widget.value)}
                            onChange={(event) => handleWidgetSelect(event, widget.value)}
                          />
                        }
                        label={widget.label}
                      />
                    ))}
                    {/* Button to add a new custom widget */}
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsAddingNewWidget(true);
                      }}
                      sx={{ mt: 2 }}
                    >
                      Add New Widget
                    </Button>
                    {/* Conditional rendering for the input fields */}
                    {isAddingNewWidget && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          label="Widget Name"
                          value={newWidgetName}
                          onChange={(e) => setNewWidgetName(e.target.value)}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Widget Text"
                          value={newWidgetText}
                          onChange={(e) => setNewWidgetText(e.target.value)}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleAddNewWidget}
                          fullWidth
                        >
                          Add
                        </Button>
                      </Box>
                    )}
                  </FormGroup>
                </Grid>
              ))}
            </Grid>
            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={handleCloseDrawer}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleConfirmWidgets}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Dashboard;
