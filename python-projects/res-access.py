# - A user can be granted access to a resource directly
# - A user can be a member of a group
# - A group can be granted access to a resource, which gives its members indirect access

# We want to find all resources a given user has access to:

# On initialization, you are given a list of resource<>user, group<>user, and resource<>group assignments.

# resource_users = [["resource1", "user1"], ["resource3", "user3"]]
# group_users = [["group1", "user1"], ["group2", "user2"]]
# group_resources = [["group1", "resource1"], ["group1", "resource2"], 
#   ["group2", "resource2"]]

# get_user_access("user1") => ["resource1", "resource2"]
# get_user_access("user2") => ["resource2"]

# ** Make sure your design supports proper state management, i.e. after processing the initial state, it supports adding and removing new edges. While you don't have to implement this code, give a detailed explanation for how you would add this.


resource_users = [["resource1", "user1"], ["resource3", "user3"]]

group_users = [["group1", "user1"], ["group2", "user2"]]
group_resources = [["group1", "resource1"], ["group1", "resource2"], 
    ["group2", "resource2"]]

# preprocessing
"""
[
    resource1: {
        user: [user1]
        groups: [group1]
    },

    users: []
    groups: []

]
"""

"""
 {user: resource
}

}
"""
def preprocess_users():
    resource_access = {}
    for tup in resource_users:
        if tup[1] not in resource_access:
            resource_access[tup[1]] = [tup[0]]
        else:
            resource_access[tup[1]].append(tup[0])

    return resource_access
    # list of user resources
    # user_list = resource_access.items()
    # print(user_list)


def preprocess_groups():
    resource_access = {}
    for tup in group_users:
        if tup[1] not in resource_access:
            resource_access[tup[1]] = [tup[0]]
        else:
            resource_access[tup[1]].append(tup[0])
    # list of user resources
    # groups_list = resource_access.items()
   
    groups_from_resources = {}
    for tup in group_resources:
        if tup[0] not in groups_from_resources:
            groups_from_resources[tup[0]] = [tup[1]]
        else:
            groups_from_resources[tup[0]].append(tup[1])

    # looop through resource_access and then replace with the values for groups_from_resources group -> [resource_1, resource_2]

    # print(resource_access)
    # print(groups_from_resources)
    return resource_access, groups_from_resources

users_access = preprocess_users()
groups_access, groups_from_resources = preprocess_groups()
# print(users_access)
# map from user -> resources
def get_user_access(user: str) -> list:
    resource_from_users = users_access.get(user, [])
    groups_from_user = groups_access.get(user, [])

    group_resources = []
    for gr in groups_from_user:
        res = groups_from_resources.get(gr, [])
        group_resources.extend(res)

    # print(resource_from_users)
    # print(group_resources)
    resource_from_users.extend(group_resources)
    return list(set(resource_from_users))
    
print(get_user_access("user1")) # ["resource1", "resource2"]
# case 2: remove user 1 from group 1
print(get_user_access("user2")) # ["resource2"]
