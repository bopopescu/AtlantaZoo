class User(object):

    def __init__(self, username, email, password, user_type):
        self.username = username
        self.email = email
        self.password = password
        self.user_type = user_type

        @username.setter
        def username(self, u):
            if not u: raise Exception('username cannot be empty')
            self._username = u

        # email = property(operator.attrgetter('_email'))

        # @email.setter
        # def value(self, e):
        #     if not (e ='*@')


class Exhibit(object):

    def __init__(self, exhibit_name, water_feature, size):
        self.exhibit_name = exhibit_name
        self.water_feature = water_feature
        self.size = size

    def exhibit_name(self):
        return self.exhibit_name


class Animal(object):
    def __init__(self, animal_name, species, animal_type, age):
        self.animal_name = animal_name
        self.species = species
        self.animal_type = animal_type
        self.age = age
        self.exhibit_name = Exhibit.exhibit_name


class Show(object):

    def __init__(self, show_name, show_time, staff_name, exhibit_name):
        self.show_name = show_name
        self.show_time = show_time
        self.staff_name = staff_name
        self.exhibit_name = exhibit_name


class Note(object):

    def __init__(self, staff_username, log_time, note, animal_name, animal_species):
        self.staff_username = staff_username
        self.log_time = log_time
        self.note = note
        self.animal_name = animal_name
        self.animal_species = animal_species


class Visit_show(object):

    def __init__(self, visitor_username, show_name, show_time):
        self.visitor_username = visitor_username
        self.show_name = show_name
        self.show_time = show_time


class Visit_exhibit(object):

    def __init__(self, visitor_username, exhibit_name, visit_time):
        self.visitor_username = visitor_username
        self.exhibit_name = exhibit_name
        self.visit_time = visit_time
