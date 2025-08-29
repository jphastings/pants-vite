# Pants & Vite

This toy repo shows an issue I had with `pants` building a `vite` project.

- I interpreted this error as being the absence of `uname`; I should have kept reading, the issue was that I had failed to include the needed additional files (particularly `index.html`) from the sandbox
- Once I manually included `/usr/bin` in the sandbox's `PATH`, the real error became more visible to me
- I then added some `files` as dependencies, which allows the `pants package ::` to complete, but **also hides the uname issue** (or negates it?).

## Set up

Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) and use it to install node & pnpm with:

```sh
# In this project directory
nvm install
npm install -g pnpm
```

### Demonstrating the error

Run `pants` and see the failure state.

If line wrapping isn't turned on, then take note of the line: `stderr:
/private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-1pofDY/node_modules/.bin/vite: line 4: uname: command not found`. I focused on this line, and foolishly ignored the subsequent lines.

```sh
$ pants package ::
```text
08:45:44.26 [INFO] Reading ~/src/pants-vite/.nvmrc to determine desired version for [nodejs].search_path.
08:45:46.61 [INFO] Completed: Running node build script 'build'.
08:45:46.61 [INFO] Completed: Scheduling: Running node build script 'build'.
08:45:46.61 [ERROR] 1 Exception encountered:

Engine traceback:
  in `package` goal

ProcessExecutionFailure: Process 'Running node build script 'build'.' failed with exit code 1.
stdout:

> pants-vite@1.0.0 build /private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-1pofDY
> vite build

vite v6.3.5 building for production...
✓ 0 modules transformed.
 ELIFECYCLE  Command failed with exit code 1.

stderr:
/private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-1pofDY/node_modules/.bin/vite: line 4: uname: command not found
✗ Build failed in 4ms
error during build:
Could not resolve entry module "./index.html".
    at getRollupError (file:///private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-1pofDY/node_modules/.pnpm/rollup@4.43.0/node_modules/rollup/dist/es/shared/parseAst.js:401:41)
    at error (file:///private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-1pofDY/node_modules/.pnpm/rollup@4.43.0/node_modules/rollup/dist/es/shared/parseAst.js:397:42)
    at ModuleLoader.loadEntryModule (file:///private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-1pofDY/node_modules/.pnpm/rollup@4.43.0/node_modules/rollup/dist/es/shared/node-entry.js:21429:20)
    at async Promise.all (index 0)
```

## Making the real error more prominent

Edit `BUILD` and uncomment line 16 (the `extra_env_vars` line). This hid the `uname` error, and allowed me to debug:

```sh
$ pants package ::
09:06:23.57 [INFO] Reading ~/src/pants-vite/.nvmrc to determine desired version for [nodejs].search_path.
09:06:24.96 [INFO] Completed: Installing pants-vite@1.0.0.
09:06:24.97 [INFO] Completed: Scheduling: Installing pants-vite@1.0.0.
09:06:26.97 [INFO] Completed: Running node build script 'build'.
09:06:26.97 [INFO] Completed: Scheduling: Running node build script 'build'.
09:06:26.97 [ERROR] 1 Exception encountered:

Engine traceback:
  in `package` goal

ProcessExecutionFailure: Process 'Running node build script 'build'.' failed with exit code 1.
stdout:

> pants-vite@1.0.0 build /private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-Ek8SzV
> vite build

vite v6.3.5 building for production...
✓ 0 modules transformed.
 ELIFECYCLE  Command failed with exit code 1.

stderr:
✗ Build failed in 4ms
error during build:
Could not resolve entry module "./index.html".
    at getRollupError (file:///private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-Ek8SzV/node_modules/.pnpm/rollup@4.43.0/node_modules/rollup/dist/es/shared/parseAst.js:401:41)
    at error (file:///private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-Ek8SzV/node_modules/.pnpm/rollup@4.43.0/node_modules/rollup/dist/es/shared/parseAst.js:397:42)
    at ModuleLoader.loadEntryModule (file:///private/var/folders/cn/x01prt2d69gf01kxxl5_dw_40000gn/T/pants-sandbox-Ek8SzV/node_modules/.pnpm/rollup@4.43.0/node_modules/rollup/dist/es/shared/node-entry.js:21429:20)
    at async Promise.all (index 0)



Use `--keep-sandboxes=on_failure` to preserve the process chroot for inspection.
```

### Fixing it

Then visit `BUILD` and uncomment line 14 (the `dependencies` line), providing my HTML files to the sandbox. Now see a successful run:

```sh
$ pants package ::
08:58:04.28 [INFO] Initializing scheduler...
08:58:04.42 [INFO] Scheduler initialized.
08:58:04.48 [INFO] Reading ~/src/pants-vite/.nvmrc to determine desired version for [nodejs].search_path.
08:58:04.59 [INFO] Completed: Scheduling: Test binary ~/.nvm/versions/node/v24.2.0/bin/node.
08:58:04.61 [INFO] Completed: Scheduling: Test binary /bin/bash.
08:58:04.61 [INFO] Completed: Scheduling: Test binary /opt/homebrew/bin/bash.
08:58:04.61 [INFO] Completed: Scheduling: Enabling corepack shims
08:58:04.62 [INFO] Completed: Scheduling: Preparing configured pnpm@10.12.1.
08:58:04.65 [INFO] Completed: Scheduling: Installing pants-vite@1.0.0.
08:58:04.68 [INFO] Completed: Scheduling: Running node build script 'build'.
08:58:04.68 [INFO] Wrote dist/dist
```
