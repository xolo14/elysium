import os from "node:os";

const originalNets = os.networkInterfaces.bind(os);
const originalCpus = os.cpus.bind(os);

os.networkInterfaces = () => {
  try {
    const nets = originalNets();
    if (nets && Object.keys(nets).length > 0) return nets;
  } catch {
    // sandbox / restricted environments
  }
  return {
    lo0: [
      {
        address: "127.0.0.1",
        netmask: "255.0.0.0",
        family: "IPv4",
        mac: "00:00:00:00:00:00",
        internal: true,
        cidr: "127.0.0.1/8",
      },
    ],
  };
};

os.cpus = () => {
  try {
    const cpus = originalCpus();
    if (cpus && cpus.length > 0) return cpus;
  } catch {
    // sandbox / restricted environments
  }
  return [
    {
      model: "sandbox",
      speed: 0,
      times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 },
    },
  ];
};
