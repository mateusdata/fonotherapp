import { device, element, by, expect } from 'detox';

describe('Calendar Component Tests', () => {
  beforeAll(async () => {
    await device.launchApp(); // Lança o aplicativo
  });

  it('should select a date and display it', async () => {
    // Encontra o calendário e clica em uma data específica
    await element(by.id('calendar')).tapAtPoint({ x: 50, y: 100 }); // Posição aproximada de uma data

    // Verifica se a data foi selecionada e exibida no texto
    await expect(element(by.id('selected-date-text'))).toHaveText('2024-10-27');
  });
});
