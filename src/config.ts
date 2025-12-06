interface ServerConfig {
  port: number;
}

interface Config {
  server: ServerConfig;
}

export const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10)
  }
};

