import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';

import { Activity } from 'app/models/activity';
import NavBar from './NavBar';
import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard';
import agent from 'app/api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await agent.Activities.list();
      let activities: Activity[] = [];
      data.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      });
      setActivities(activities);
      setLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(activity => activity.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  async function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      await agent.Activities.update(activity);
      setActivities([
        ...activities.filter(x => x.id !== activity.id),
        activity,
      ]);
      setEditMode(false);
      setSelectedActivity(activity);
      setSubmitting(false);
    } else {
      activity.id = uuid();
      await agent.Activities.create(activity);
      setActivities([...activities, activity]);
      setEditMode(false);
      setSelectedActivity(activity);
      setSubmitting(false);
    }
  }

  async function handleDeleteActivity(id: string) {
    setSubmitting(true);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(x => x.id !== id)]);
    setSubmitting(false);
  }

  if (loading) return <LoadingComponent content="Loading app" />;

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
