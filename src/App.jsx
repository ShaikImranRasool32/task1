import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from './components/Navbar'; // Assuming Navbar component is available
import Dashboard from './components/Dashboard'; // Import the Dashboard component

function App() {
    const [dateRange, setDateRange] = useState(null);

    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
    };

    const handleAddWidgetClick = () => {
        // Handle widget addition logic
        console.log('Add Widget Clicked');
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                onAddWidgetClick={handleAddWidgetClick}
            />
            <Box sx={{ flexGrow: 1, overflow: 'auto', marginTop: '70px' }}> {/* Added marginTop */}
                <Dashboard />
            </Box>
        </Box>
    );
}

export default App;
