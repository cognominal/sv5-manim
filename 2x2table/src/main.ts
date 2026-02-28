import { mount } from 'svelte';
import App from './App.svelte';
import '@shared/theme/tokens.css';
import '@shared/theme/base.css';
import '@shared/theme/manim-dark.css';
import './app.css';

mount(App, {
  target: document.getElementById('app')!,
});
