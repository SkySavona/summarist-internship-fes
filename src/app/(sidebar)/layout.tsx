"use client";

import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';

export default function SidebarPageLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}