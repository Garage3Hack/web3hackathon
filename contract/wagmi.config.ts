import { defineConfig } from '@wagmi/cli'
import { hardhat } from '@wagmi/cli/plugins'
import { react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: '../frontend/contracts/generated.ts',
  contracts: [],
  plugins: [
    hardhat({
      project: '../contract',
      commands: {
        clean: 'npx hardhat clean',
        build: 'npx hardhat compile',
        rebuild: 'npx hardhat compile',
      },
    }),
    react(),
  ],
})
