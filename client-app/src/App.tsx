import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

import './App.css';

function App() {
  const [activities, setActivities] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('http://localhost:5000/api/activities');
      setActivities(data);
      console.log(data);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <div>
      <Header as="h2" icon="users" content="Reactivities" />

      <List>
        {activities.map((activity: any) => (
          <List.Item key={activity.id}>{activity.title}</List.Item>
        ))}
      </List>
    </div>
  );
}

export default App;
