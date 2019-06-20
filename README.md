# toggle-file README

This extension adds `Toggle file (extension.toggleFile)` command. That command is useful for toggling between test and tested file.

## Features

This extension adds `Toggle file (extension.toggleFile)` command.
That translates active file path with rules in settings.json and open translated path (if not exists, asks to create file).

## Requirements

None.

## Extension Settings

This extension contributes the following settings:

* `toggleFile.rules`: Array of rules.

Rules are defined as below:

```json
[
  {
    "from": "app/(.+).rb",
    "to": "spec/$1_spec.rb"
  },
  {
    "from": "script/(.+).rb",
    "to": "spec/script/$1_spec.rb"
  },
  {
    "from": "lib/(.+).rb",
    "to": "spec/$1_spec.rb"
  },
  {
    "from": "spec/(controllers|decorators|helpers|jobs|mailers|models|uploaders|validators|views)/(.+)_spec.rb",
    "to": "app/$1/$2.rb"
  },
  {
    "from": "spec/script/(.+)_spec.rb",
    "to": "script/$1.rb"
  },
  {
    "from": "spec/(.+)_spec.rb",
    "to": "lib/$1.rb"
  }
]
```

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release.
