# ubahn

It is a (node.js) command line utility that helps you going everywhere in your computer using a terminal. It is based on [teleport](https://hackage.haskell.org/package/teleport), a Haskell package that accomplishes the same task.

## API

### List Directories

To list all directories that were saved to *ubahn*, run this command:

```sh
ubahn list
```



### Goto Directory

To change the current directory to one saved in *ubahn*, run this command:

``` shell
ubahn goto <directory short name>
```


### Add Directory

To add a new directory, run this command:

``` shell
ubahn add <directory short name> [directory path]
```

The *directory short name* cannot contain spaces and should have at most 6 characters. The directory path may be omitted. That will make the current directory to be added to *ubahn*.


## Remove Directory

To remove a directory, run this command:

``` shell
ubahn rm <directory short name>
```
