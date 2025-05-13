import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    socket.on('room_update', (players) => setPlayers(players));
    socket.on('card_drawn', ({ playerId, card }) => {
      setCards((prev) => [...prev, `${playerId} drew ${card.name}`]);
    });
  }, []);

  const joinRoom = () => {
    socket.emit('join_room', roomId);
    setJoined(true);
  };

  const drawCard = () => {
    socket.emit('draw_card', { roomId, playerId: socket.id });
  };

  return (
    <div>
      <h1>Vanguard Online</h1>
      {!joined ? (
        <div>
          <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room ID" />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <h2>Room: {roomId}</h2>
          <p>Players: {players.join(', ')}</p>
          <button onClick={drawCard}>Draw Card</button>
          <ul>
            {cards.map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
