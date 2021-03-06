import { expandPackageList } from 'shipjs-lib';
import { run, print } from '../../../util';
import runPublish from '../runPublish';
import { mockPrint } from '../../../../tests/util';

describe('runPublish', () => {
  it('works with yarn', () => {
    runPublish({
      isYarn: true,
      config: {
        publishCommand: ({ defaultCommand }) => defaultCommand,
      },
      releaseTag: 'latest',
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "yarn publish --no-git-tag-version --non-interactive --tag latest",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });

  it('works with npm', () => {
    runPublish({
      isYarn: false,
      config: {
        publishCommand: ({ defaultCommand }) => defaultCommand,
      },
      releaseTag: 'latest',
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "npm publish --tag latest",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });

  it('works with monorepo', () => {
    const output = [];
    mockPrint(print, output);
    expandPackageList.mockImplementationOnce(() => [
      '/package-a',
      '/package-b',
    ]);
    runPublish({
      isYarn: true,
      config: {
        publishCommand: ({ defaultCommand }) => defaultCommand,
        monorepo: {},
      },
      releaseTag: 'latest',
      dir: '.',
      dryRun: false,
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Publishing.",
        "Running the following at /package-a",
        "Running the following at /package-b",
      ]
    `);
    expect(run).toHaveBeenCalledTimes(2);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "yarn publish --no-git-tag-version --non-interactive --tag latest",
        "dir": "/package-a",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "yarn publish --no-git-tag-version --non-interactive --tag latest",
        "dir": "/package-b",
        "dryRun": false,
      }
    `);
  });
});
