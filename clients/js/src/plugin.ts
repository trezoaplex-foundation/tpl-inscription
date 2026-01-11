import { UmiPlugin } from '@trezoaplex-foundation/umi';
import { createMplInscriptionProgram } from './generated';

export const tplInscription = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplInscriptionProgram(), false);
  },
});
