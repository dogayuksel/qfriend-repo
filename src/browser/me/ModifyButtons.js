/* @flow */
import React from 'react';
import { Text, Button, Box } from '../app/components';

class ModifyButtons extends React.Component {
  static propTypes = {
    fields: React.PropTypes.object,
    disabled: React.PropTypes.bool,
  };

  modifyValue = (fields: Object, param: string) => {
    const data = ({ ...fields.$values() });
    switch (param) {
      case '0': { fields.$setValue('value', 0); return; }
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
      <Box>
        <Button
          marginHorizontal={0.2}
          primary
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '0')}
        >
          0
        </Button>
        <Button
          marginHorizontal={0.2}
          primary
          disabled={disabled}
          onClick={() => this.modifyValue(fields, 'x2')}
        >
          x2
        </Button>
        <Button
          marginHorizontal={0.2}
          primary
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '/2')}
        >
          /2
        </Button>
        <Button
          marginHorizontal={0.2}
          primary
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '+10')}
        >
          +10
        </Button>
        <Button
          marginHorizontal={0.2}
          primary
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '-10')}
        >
          -10
        </Button>
      </Box>
    );
  }
}

export default ModifyButtons;
