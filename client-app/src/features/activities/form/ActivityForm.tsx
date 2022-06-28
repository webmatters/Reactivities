import React, { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import { observer } from 'mobx-react-lite';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { useStore } from 'app/stores/store';
import LoadingComponent from 'app/layout/LoadingComponent';
import MyTextInput from 'app/common/form/MyTextInput';
import MyTextArea from 'app/common/form/MyTextArea';
import MySelectInput from 'app/common/form/MySelectInput';
import { categoryOptions } from 'app/common/options/categoryOptions';
import MyDateInput from 'app/common/form/MyDateInput';
import { Activity } from 'app/models/activity';

function ActivityForm() {
  const history = useHistory();
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    loading,
    loadingInitial,
    loadActivity,
  } = activityStore;
  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: null,
    city: '',
    venue: '',
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required.'),
    description: Yup.string().required('Description is required.'),
    category: Yup.string().required(),
    date: Yup.string().required('Date is required.').nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id)
      loadActivity(id).then(activity => {
        setActivity(activity!);
      });
  }, [id, loadActivity]);

  function handleFormSubmit(activity: Activity) {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      updateActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={activity}
        onSubmit={values => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />
            <MyTextArea name="description" rows={3} placeholder="Description" />
            <MySelectInput
              name="category"
              placeholder="Category"
              options={categoryOptions}
            />
            <MyDateInput
              name="date"
              placeholderText="Date"
              showTimeSelect
              timeCaption="time"
              dateFormat={'MMMM d, yyyy h:mm aa'}
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput name="city" placeholder="City" />
            <MyTextInput name="venue" placeholder="Venue" />
            <Button
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
              disabled={isSubmitting || !dirty || !isValid}
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
}

export default observer(ActivityForm);
