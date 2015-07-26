import sys

# list of acceptable commands
COMMANDS = ['DEPEND', 'INSTALL', 'REMOVE', 'LIST', 'END']

# list containing Dependency objects
DEPENDENCY_LIST = []

# list containing names of dependencies
DEPENDENCY_NAMES = []

# list containing installed Dependency objects
INSTALLED_DEPENDENCIES = []

# list containing installed Dependency names
INSTALLED_DEPENDENCY_NAMES = []


class Dependency:
    # requires a list command_verb
    # requires a list of dependencies
    def __init__(self, *args, **kwargs):
            self.name = kwargs['name']
            self.dependencies = kwargs['deps']


#################################
#  DEPEND
def create_dependency(*args, **kwargs):
    new_dep = Dependency(**kwargs)

    if not is_circular_dependency(new_dep):
            DEPENDENCY_LIST.append(new_dep)
            DEPENDENCY_NAMES.append(new_dep.name)


# check circular dependency
# returns Boolean
def is_circular_dependency(new_dep):
    new_dep_name = new_dep.name
    for dep in DEPENDENCY_LIST:
            for _dep in dep.dependencies:
                    if new_dep_name == _dep:
                            print("{} depends on {}. Ignoring command".format(dep.name, new_dep_name))
                            return True

    return False


#################################
# INSTALLS 
#################################
def install_dependency(name):
    for dep in DEPENDENCY_LIST:
        if name == dep.name:
            if not _is_installed(name):
                _install_deps(dep.dependencies)
                INSTALLED_DEPENDENCIES.append(dep)
            else:
                print('{} is already installed'.format(name))


def _is_installed(name):
    return name in INSTALLED_DEPENDENCY_NAMES


def _install_deps(arr):
    for item in arr:
        if not _check_existing_dep_installed(item):
            print('    INSTALLING {}'.format(item))
            INSTALLED_DEPENDENCY_NAMES.append(item)


# returns boolean
def _check_existing_dep_installed(name):
    for dep in INSTALLED_DEPENDENCIES:
        if name in dep.dependencies:
            return True
    return False


#################################
# REMOVE
#################################
def remove_dependency(name):
    for dep in DEPENDENCY_LIST:
        if name == dep.name:
            if _can_remove(name):
                _remove_deps(dep)
            else:
                print('{} is still needed'.format(name))


# check if can remove based on existing dependencies
def _can_remove(name):
    for dep in INSTALLED_DEPENDENCIES:
        if name in dep.dependencies:
            return False
    return True


def _remove_deps(dep):
    # remove from Dep list
    for idx, _dep in enumerate(INSTALLED_DEPENDENCIES):
        if _dep == dep:
            DEPENDENCY_LIST.remove(idx)

    # remove from Dep nane list
    for idx, _dep in enumerate(INSTALLED_DEPENDENCY_NAMES):
        if _dep.name == dep.name:
            DEPENDENCY_LIST.remove(idx)


if __name__ == '__main__':
    # read user inputs
    while 1:
        # get command line input stripping newline
        command_input = sys.stdin.readline().rstrip('\n')
        command_input = command_input.split()

        # check any commands
        if (len(command_input) < 1):
            print('needs a valid input')

        command_verb = command_input[0]

        # check valid command
        if command_verb not in COMMANDS:
            print('invalid command')

        if command_verb == 'DEPEND':
            # try:
            name = command_input[1]
            deps = command_input[2:]
            create_dependency(name=name, deps=deps)
            # except:
            # 	print('at least one depency needed')

        if command_verb == 'INSTALL':
            try:
                name = command_input[1]
                if name not in DEPENDENCY_NAMES:
                        print('idk man')
                install_dependency(name=name)
            except:
                print('dependency needs to be specified')

        if command_verb == 'REMOVE':
            name = command_input[1]
            if name not in INSTALLED_DEPENDENCY_NAMES:
                print('need to install before removing')
            remove_dependency(name=name)

        if command_verb == 'LIST':
            for dep in DEPENDENCY_LIST:
                print(dep.name)

        if command_verb == 'END':
            print('END')
            sys.exit(0)
