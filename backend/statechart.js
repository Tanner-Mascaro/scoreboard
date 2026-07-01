// Connection State Chart

const states = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting'
};

function transition(currentState, event) {
    //state rules. Change based on what it currently is and what its changing too
    switch(currentState) {
        case states.DISCONNECTED: 
            if (event === 'connect') return states.CONNECTING;
            break;

        case states.CONNECTING:
            if (event === 'success') return states.CONNECTED;
            if (event === 'fail') return states.RECONNECTING;
            break;

        case states.CONNECTED:
            if (event === 'disconnect') return states.RECONNECTING;
            break;

        case states.RECONNECTING:
            if (event === 'success') return states.CONNECTED; 
            if (event === 'give_up') return states.DISCONNECTED;
            break;
    }
    return currentState;
    
}

module.exports = { states, transition };