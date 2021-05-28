import toml from 'toml';
import fs from 'fs';
import path from 'path';

const config = toml.parse(fs.readFileSync(process.cwd() + '/setting.toml', 'utf-8'));

export const Config = () => config;
