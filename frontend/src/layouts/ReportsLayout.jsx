import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DatePickerTrigger from '../components/Transactions/DatePickerTrigger'; // Ensure this path is correct
import { Search, Bell } from 'lucide-react';
import '../sass/ReportsLayout.scss';

const ReportsLayout = ({ children }) => {
    const [currentDate, setCurrentDate] = useState('Oct 2026');
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const toggleDatePicker = () => {
        setIsOpen(!isOpen);
        console.log("Open calendar picker UI here");
    };

    return (
        <div className="reports-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ReportsLayout;