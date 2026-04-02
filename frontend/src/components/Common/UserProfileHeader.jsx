import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../sass/UserProfileHeader.scss';

import '../../sass/UserProfileHeader.scss';

const UserProfileHeader = ({ variant = 'header' }) => {
    const [userProfile, setUserProfile] = useState({ name: 'User', email: 'user@example.com' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const API_URL_RAW = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const API_URL = (() => {
                    const base = String(API_URL_RAW).replace(/\/+$/, '');
                    return base.endsWith('/api') ? base : `${base}/api`;
                })();

                const res = await axios.get(`${API_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data) {
                    setUserProfile({
                        name: res.data.name || res.data.username || (res.data.firstName ? `${res.data.firstName} ${res.data.lastName || ''}`.trim() : 'User'),
                        email: res.data.email || 'user@example.com'
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className={`user-profile ${variant === 'sidebar' ? 'user-profile-sidebar' : ''}`}>
            {variant === 'sidebar' && (
                <div className="avatar">
                    <div className="avatar-fallback">{getInitials(userProfile.name)}</div>
                </div>
            )}
            <div className="user-info">
                <span className="user-name">{userProfile.name}</span>
                <span className="user-role">{userProfile.email}</span>
            </div>
            {variant === 'header' && (
                <div className="avatar">
                    <div className="avatar-fallback">{getInitials(userProfile.name)}</div>
                </div>
            )}
        </div>
    );
};

export default UserProfileHeader;
