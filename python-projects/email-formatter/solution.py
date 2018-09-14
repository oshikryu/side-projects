import re
import json
from operator import itemgetter

FORMAT_1 = 'format1'
FORMAT_2 = 'format2'
FORMAT_3 = 'format3'

REGEX_PATTERNS = {
    FORMAT_1: '(.*)(?::)(.*)(?::)(.*)',
    FORMAT_2: '(.*)(?:--)(.*)(?::)(.*)',
    FORMAT_3: '(.*)(?:;)(.*)(?:;)(.*)',
}

# gratuitously taken from https://stackoverflow.com/a/2669120/1557887
def sorted_nicely( l ): 
    """ Sort the given iterable in the way that humans expect.""" 
    convert = lambda text: int(text) if text.isdigit() else text 
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ] 
    return sorted(l, key = alphanum_key)

def check_email(email_string):
    # string -> list
    """
    Check the email string for
    """
    valid_emails = set()
    email_arr = email_string.split(',')
    for email in email_arr:
        # check for valid email with stackoverflow email regex
        valid_groups = re.search('(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)', email)
        if valid_groups is not None:
            valid_emails.add(email)

    return list(sorted_nicely(valid_emails))

def package_formatter(format_type, groups):
    # (str, tuple) -> dict | None
    """
    Create the relevant dict
    """
    if format_type is FORMAT_1:
        # TODO: check valid emails
        emails = check_email(groups[2])
        if (len(emails) == 0):
            return None
        return dict(
            package=groups[0],
            company=groups[1],
            emails=emails
        )
    elif format_type is FORMAT_2:
        emails = check_email(groups[2])
        if (len(emails) == 0):
            return None
        return dict(
            package=groups[1],
            company=groups[0],
            emails=emails
        )
    elif format_type is FORMAT_3:
        emails = check_email(groups[0])
        if (len(emails) == 0):
            return None
        return dict(
            package=groups[1],
            company=groups[2],
            emails=emails
        )
    else:
        return None


def read_and_format():
    """
    Take input file and match for regex
    List is used instead of set() because set() cannot take dicts as a value
    """
    # () -> (generator)
    with open('input.txt') as inputfile:
        all_packages = list()
        package_counter = dict()
        for line in inputfile:
            for format_type in REGEX_PATTERNS.keys():
                matches = re.search(REGEX_PATTERNS[format_type], line)
                if (matches is not None and len(matches.groups()) > 0):
                    obj = package_formatter(format_type, matches.groups())
                    # skip if package cannot be correctly formatted
                    if obj is None:
                        continue

                    # get cumulative count
                    if package_counter.get(obj['package']) is None:
                        package_counter[obj['package']] = 1
                    else:
                        package_counter[obj['package']] += 1

                    obj.update({'count': package_counter[obj['package']]})
                    all_packages.append(obj)

        yield all_packages


# gratuitously taken from https://stackoverflow.com/a/73050/1557887
def sort_packages(all_packages):
    # (generator) -> (generator)
    """
    sorts the list of packages by package name alphanumerically
    """
    for packages in all_packages:
        sorted_packages = sorted(packages, key=lambda k: k['package'])
    yield sorted_packages


def write_to_output(sorted_packages):
    # (generator) -> None
    """
    Writes the sorted list into output.json as a text file
    """
    with open('output.json', 'w') as outputfile:
        for sort_packs in sorted_packages:
            package_str = json.dumps(sort_packs)
            outputfile.write(package_str)

def main():
    all_packages = read_and_format()
    sorted_packages = sort_packages(all_packages)
    write_to_output(sorted_packages)
    print('Check output.json')


if __name__ == "__main__":
    main()
