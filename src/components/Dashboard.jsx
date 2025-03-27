import React, { useEffect, useState } from 'react';
import DashboardTable from './DashboardTable'
import { temporaryProjects } from '../projects';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(()=>{
    setProjects(temporaryProjects)
  },[])

  return (
<div className="flex h-screen w-screen">
  <div className="bg-green-200 w-[299px]">
    Left
  </div>
  <div className="flex-1 flex flex-col">
    <div className="bg-rose-800 h-[80px]">Top</div>
  
    <div className="flex-grow p-8">
      <DashboardTable projects={projects}/>
    </div>
  </div>
</div>
  );
};

export default Dashboard;