// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EPIListPage from './pages/EPIListPage';
import EpiDetailPage from './pages/EPIDetailPage';
import ControleListPage from './pages/ControleListPage';
import AlertPage from './pages/AlertPage';
import CritiquePage from './pages/CritiquePage';
import ProtectedRoute from './ProtectedRoute';
import SignUpPage from './pages/SignupPage';
import CreateEPIPage from './pages/CreateEPIPage'
import CreateControlePage from './pages/CreateControlePage'
import ControleDetailPage from "./pages/ControleDetailPage";



const App: React.FC = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Routes protégées */}
          <Route path="/epis" element={
            <ProtectedRoute>
              <EPIListPage />
            </ProtectedRoute>
          } />
          <Route path="/epis/:id" element={
            <ProtectedRoute>
              <EpiDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/controles" element={
            <ProtectedRoute>
              <ControleListPage />
            </ProtectedRoute>
          } />
          <Route
          path="/controles/new"
          element={
            <ProtectedRoute>
              <CreateControlePage />
            </ProtectedRoute>
          }/>
          <Route path="/alertes" element={
            <ProtectedRoute>
              <AlertPage />
            </ProtectedRoute>
          } />
          <Route path="/critique" element={
            <ProtectedRoute>
              <CritiquePage />
            </ProtectedRoute>
          } />
          <Route
          path="/epis/new"
          element={
            <ProtectedRoute>
              <CreateEPIPage />
            </ProtectedRoute>
          } />
          <Route
          path="/controles/:id"
          element={
            <ProtectedRoute>
              <ControleDetailPage />
            </ProtectedRoute>
          } />
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/epis" />} />
        </Routes>
      </BrowserRouter>
    );
  };

export default App;
