import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

export const statusCheck = async () => {
  const services = {
    api: 'http://localhost:3000/api/health',
    db: 'http://db:5432',
    pgadmin: 'http://pgadmin:80'
  };

  const results: Record<string, string> = {};
  
  for (const [service, url] of Object.entries(services)) {
    try {
      const response = await fetch(url);
      results[service] = response.ok ? 'OK' : 'ERROR';
    } catch (error) {
      console.error(`Erreur pour ${service}:`, error);
      results[service] = 'ERROR';
    }
  }

  return results;
};
