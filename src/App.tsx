import React, { useState, useCallback, useMemo } from 'react';

import api from './services/api';

import Video from './components/Video';

interface IResponse {
  room: {
    uniqueName: string;
  };
  tokens: string[];
}

const App: React.FC = () => {
  const [name, setName] = useState<string>(); 

  const handleSubmit = useCallback(async () => {
    console.log('submit');

    const response = await api.post<IResponse>('rooms', {
      users: [name, `${name}-two`],
    });

    const { data } = response;
    
    console.log(data);
    
    if (!localStorage.getItem('@TwilioVideoReact:room')) {
      localStorage.setItem('@TwilioVideoReact:room', JSON.stringify(data.room.uniqueName));
    }
   
    localStorage.setItem('@TwilioVideoReact:token', JSON.stringify(data.tokens[0]));
  }, [name]);

  const token = useMemo(() => {
    const storaged = localStorage.getItem('@TwilioVideoReact:token');

    if (storaged) {
      const token = JSON.parse(storaged);

      return token;
    }

    return null;
  }, []);

  const roomName = useMemo(() => {
    const storaged = localStorage.getItem('@TwilioVideoReact:room');

    if (storaged) {
      const token = JSON.parse(storaged);

      return token;
    }

    return null;
  }, []);
 
  return (  
    <> 
      {!!token && (
        <Video token={token} name={roomName} />
      )}

      <form>
        <label htmlFor="name">
          Nome <br />
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={event => setName(event.target.value)} 
          />
        </label>
        <br />
        <button type="button" onClick={handleSubmit}>
          Criar sala
        </button>
      </form>
    </>
  )
}

export default App;
