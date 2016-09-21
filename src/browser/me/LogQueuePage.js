/* @flow */
import * as adminActions from '../../common/admin/actions';
import * as venueActions from '../../common/venues/actions';
import QueueData from '../queue/QueueData';
import React from 'react';

import linksMessages from '../../common/app/linksMessages';
import { Pre, Block, Text, Form, Input, FieldError, Button, Title, View } from '../app/components';
import { ValidationError } from '../../common/lib/validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { queryFirebase } from '../../common/lib/redux-firebase';
import { fields } from '../../common/lib/redux-fields';

const styles = {
  valueField: {
    maxWidth: '120px',
    display: 'inline-block',
  },
};

type State = {
  disabled: boolean,
  error: ?Object,
  submittedValues: ?Object,
};

class ModifyButtons extends React.Component {
  static propTypes = {
    fields: React.PropTypes.object,
    disabled: React.PropTypes.bool,
  };

  modifyValue = ( fields, param ) => {
    const data = ({ ...fields.$values() });
    console.log(data);
    switch (param) {
      case 'x2': { fields.$setValue('value', data.value * 2); return; }
      case '/2': {
        fields.$setValue('value', parseInt(data.value / 2, 10));
        return;
      }
      case '+10': {
        fields.$setValue('value', parseInt(data.value, 10) + 10);
        return;
      }
      case '-10': { fields.$setValue('value', data.value - 10); return; }
      default: return;
    }
  };

  render() {
    const { disabled, fields } = this.props;
    return (
      <View>
        <Button
          mb={3} ml={1} type="button"
          disabled={disabled}
          onClick={() => this.modifyValue(fields, 'x2')}
        >
          <Text>x2</Text>
        </Button>
        <Button
          mb={3} ml={1} type="button"
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '/2')}
        >
          <Text>/2</Text>
        </Button>
        <Button
          mb={3} ml={1} type="button"
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '+10')}
        >
          <Text>+10</Text>
        </Button>
        <Button
          mb={3} ml={1} type="button"
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '-10')}
        >
          <Text>-10</Text>
        </Button>
      </View>
    );
  }
}

class LogQueuePage extends React.Component {

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    venues: React.PropTypes.object,
    viewer: React.PropTypes.object.isRequired,
    activeEntry: React.PropTypes.String,
    adminActions: React.PropTypes.object.isRequired,
  };

  state: State = {
    disabled: false,
    error: null,
    submittedValues: null,
  };

  onFormSubmit = () => {
    const { fields,
            activeEntry,
            viewer,
            adminActions: { addQueueEntry },
    } = this.props;

    const queueData = ({ ...fields.$values() });
    // Disable form.
    this.setState({ disabled: true });

    addQueueEntry(activeEntry, queueData, viewer);
    // This is just a demo. This code belongs to Redux action creator.

    // Simulate async action.
    setTimeout(() => {
      this.setState({ disabled: false });
      const isValid = true;
      if (!isValid) {
        const error = new ValidationError('required', { prop: 'value' });
        this.setState({ error, submittedValues: null });
        return;
      }
      this.setState({ error: null, submittedValues: queueData });
      fields.$reset();
    }, 500);
  }

  render() {
    const { venues, activeEntry, fields } = this.props;
    const { adminActions: { setActiveEntry } } = this.props;
    const { disabled, error } = this.state;

    return (
      <View>
        <Title message={linksMessages.me} />
        <View>
          <Text>make entries below</Text>
          <Block>
            {venues && venues.map(venue =>
              <View key={venue.key}>
                <Button
                  disabled={disabled}
                  onClick={() => setActiveEntry(venue.key)}
                >
                  {venue.title}
                </Button>
                {activeEntry === venue.key &&
                 <Form onSubmit={this.onFormSubmit}>
                  <QueueData venueKey={venue.key} />
                  <FieldError error={error} prop="name" />
                  <Input
                    {...fields.value}
                    label="Queue time"
                    style={styles.valueField}
                    aria-invalid={ValidationError.isInvalid(error, 'value')}
                    maxLength={10}
                    type="text"
                  />
                  <Button
                    mb={3} ml={2}
                    disabled={disabled}
                    type="submit"
                  >
                    <Text>Submit</Text>
                  </Button>
                  <ModifyButtons fields={fields} disabled={false} />
                </Form>
                }
              </View>)
            }
          </Block>
        </View>
      </View>
    );
  }
}

LogQueuePage = fields(LogQueuePage, {
  path: 'queuePage',
  fields: [
    'value',
  ],
  getInitialState: () => ({
    value: '20',
  }),
});

LogQueuePage = queryFirebase(LogQueuePage, ({ venueActions: { listVenues } }) => ({
  path: 'locations',
  on: { value: listVenues },
}));

function mapStateToProps(state) {
  return {
    viewer: state.users.viewer,
    venues: state.venues.venues,
    activeEntry: state.admin.get('activeEntry'),
    /* queueDetailModel: state.fields.get('queueDetailPage'),*/
  };
}

function mapDispatchToProps(dispatch) {
  return {
    venueActions: bindActionCreators(venueActions, dispatch),
    adminActions: bindActionCreators(adminActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogQueuePage);
