import unittest
import re

from solution import REGEX_PATTERNS, FORMAT_1


class TestGet(unittest.TestCase):
    def test_regex_format_1(self):
        test_strings = [
            'Cleo Select:Slack:foo@slack.fake.com,bar@slack.fake.com,baz@slack.fake.com',
            'obviously invalid',
            '1st-Time Parents:LUCY:scott@startwithlucy.com,kurt@startwithlucy.com',
            '',
        ]

        res_groups = list()
        for test_str in test_strings:
            matched = re.search(REGEX_PATTERNS[FORMAT_1], test_str)
            if matched is not None:
                print(matched.groups())
                res_groups.append(matched.groups())
            else:
                res_groups.append(None)

        expected = [
            ('Cleo Select', 'Slack', 'foo@slack.fake.com,bar@slack.fake.com,baz@slack.fake.com'),
            None,
            ('1st-Time Parents', 'LUCY', 'scott@startwithlucy.com,kurt@startwithlucy.com'),
            None,
        ]
        self.assertEqual(res_groups, expected)

if __name__ == '__main__':
    unittest.main()
