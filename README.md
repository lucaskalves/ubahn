# ubahn

It is a (node.js) command line utility that helps you going everywhere in your computer using a terminal. It is based on [teleport](https://hackage.haskell.org/package/teleport), a Haskell package that accomplishes the same task.

## Installation

First, you need to install the Node.js plugins:

``` shell
npm install --global ubahn
```

Then, to make the command executable, you need to add this to your `.bashrc` or `.bash_profile` or whatever you use:

``` shell
function ubahn() {
  OUTPUT=`ubahn-wrapper $@`
  if [ $? -eq 42 ]
  then cd "$OUTPUT"
  else echo "$OUTPUT"
  fi
}
```

## API

### List Directories

To list all directories that were saved to *ubahn*, run this command:

```sh
ubahn list
```



### To Directory

To change the current directory to one saved in *ubahn*, run this command:

``` shell
ubahn to <shortname>
```


### Add Directory

To add a new directory, run this command:

``` shell
ubahn add <shortname> [directory path]
```

The *short name* cannot contain spaces. The directory path may be omitted. That will make the current directory to be added to *ubahn*.


## Remove Directory

To remove a directory, run this command:

``` shell
ubahn rm <shortname>
```

## Remove all Directories

To remove all saved directories, run this command:

``` shell
ubahn clear
```
