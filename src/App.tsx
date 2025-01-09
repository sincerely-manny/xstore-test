import { createStoreWithProducer } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { produce } from 'immer';
import { useEffect } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

type Server = {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance";
  ip: string;
  location: string;
  uptime: string;
  ping?: number;
};

const servers: Server[] = [
  {
    id: "1",
    name: "Server Alpha",
    status: "online",
    ip: "192.168.1.1",
    location: "New York, USA",
    uptime: "72 days",
  },
  {
    id: "2",
    name: "Server Beta",
    status: "offline",
    ip: "192.168.1.2",
    location: "San Francisco, USA",
    uptime: "0 days",
  },
  {
    id: "3",
    name: "Server Gamma",
    status: "maintenance",
    ip: "192.168.1.3",
    location: "London, UK",
    uptime: "15 days",
  },
  {
    id: "4",
    name: "Server Delta",
    status: "online",
    ip: "192.168.1.4",
    location: "Tokyo, Japan",
    uptime: "120 days",
  },
  {
    id: "5",
    name: "Server Epsilon",
    status: "online",
    ip: "192.168.1.5",
    location: "Sydney, Australia",
    uptime: "200 days",
  },
];

const initialServers: Record<string, Server> = {};

const store = createStoreWithProducer(
  produce,
  {
    context: {
      servers: initialServers,
      serverIds: Object.keys(initialServers),
    },
    on: {
      add: (context, event: { server: Server }) => {
        context.servers[event.server.id] = event.server;
        context.serverIds.push(event.server.id.toString());
      },
      setPing: (
        context,
        event: { id: string; ping: number }
      ) => {
        context.servers[event.id].ping = event.ping;
      },
    },
  });

async function addServers() {
  for (const s of servers) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    console.log("Adding server", s.name);
    store.send({ type: "add", server: s });
  }
}

async function pingServers() {
  for (const s of servers) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    console.log("Pinging server", s.name);
    store.send({ type: "setPing", id: s.id, ping: Math.random() * 100 });
  }
}

function App() {
  const serverIds = useSelector(store, (state) => state.context.serverIds);

  useEffect(() => {
    addServers().then(() => {
      pingServers();
    });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        rerended App at:{' '}
        {new Date().toLocaleTimeString()}{' '}
        ({Date.now()})
      </div>
      <div className="servers">
        {serverIds.map((serverId) => (
          <Server key={serverId} serverId={Number(serverId)} />
        ))}
      </div>
    </>
  )
}

function Server({ serverId }: { serverId: number }) {
  const server = useSelector(store, (state) => state.context.servers[serverId]);
  return (
    <div
      className={`server server--${server.status}`}
    >
      <h2>{server.name}</h2>
      <p>Rerenedered at: {new Date().toLocaleTimeString()} ({Date.now()})</p>
      <p>
        <strong>IP:</strong> {server.ip}
      </p>
      <p>
        <strong>Location:</strong> {server.location}
      </p>
      <p>
        <strong>Uptime:</strong> {server.uptime}
      </p>
      <p>
        <strong>Ping:</strong> {server.ping ?? '❌'}ms
      </p>
    </div>
  );
}

export default App
