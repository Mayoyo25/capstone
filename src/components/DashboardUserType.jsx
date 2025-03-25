function  DashboardUserType({userType}){
return (
 <>
 {userType === 'Admin' && (
          <div className="admin-panel">
            <h2>Admin Controls</h2>
            <div className="admin-cards">
              <div className="admin-card">
                <h3>User Management</h3>
                <p>Manage system users</p>
              </div>
              <div className="admin-card">
                <h3>Settings</h3>
                <p>System configuration</p>
              </div>
              <div className="admin-card">
                <h3>Reports</h3>
                <p>View system reports</p>
              </div>
            </div>
          </div>
        )}
        
        {userType === 'Student' && (
          <div className="student-panel">
            <h2>Student Portal</h2>
            <div className="student-cards">
              <div className="student-card">
                <h3>Courses</h3>
                <p>View your enrolled courses</p>
              </div>
              <div className="student-card">
                <h3>Assignments</h3>
                <p>Submit and track assignments</p>
              </div>
              <div className="student-card">
                <h3>Grades</h3>
                <p>Check your grades</p>
              </div>
            </div>
          </div>
        )}
        
        {userType === 'Supervisor' && (
          <div className="supervisor-panel">
            <h2>Supervisor Dashboard</h2>
            <div className="supervisor-cards">
              <div className="supervisor-card">
                <h3>Students</h3>
                <p>Manage your students</p>
              </div>
              <div className="supervisor-card">
                <h3>Evaluations</h3>
                <p>Conduct evaluations</p>
              </div>
              <div className="supervisor-card">
                <h3>Reports</h3>
                <p>Generate reports</p>
              </div>
            </div>
          </div>
        )}
        
        {userType === 'Client' && (
          <div className="client-panel">
            <h2>Client Portal</h2>
            <div className="client-cards">
              <div className="client-card">
                <h3>Projects</h3>
                <p>View your projects</p>
              </div>
              <div className="client-card">
                <h3>Invoices</h3>
                <p>Manage invoices</p>
              </div>
              <div className="client-card">
                <h3>Support</h3>
                <p>Contact support</p>
              </div>
            </div>
          </div>
        )}
 </>
)
}

export default DashboardUserType