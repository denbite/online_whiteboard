from core import db

from datetime import date
from settings.constants import DATE_FORMAT


def commit(obj):
    """
    Function for convenient commit
    """
    db.session.add(obj)
    db.session.commit()
    db.session.refresh(obj)
    return obj


class Model(object):
    @classmethod
    def create(cls, **kwargs):
        """
        Create new record

        cls: class
        kwargs: dict with object parameters
        """
        obj = cls(**kwargs)
        return commit(obj)

    @classmethod
    def update(cls, row_id, **kwargs):
        """
        Update record by id

        cls: class
        row_id: record id
        kwargs: dict with object parameters
        """
        obj = cls.query.get(row_id)

        for key, value in kwargs.items():
            setattr(obj, key, value)

        return commit(obj)

    @classmethod
    def delete(cls, row_id):
        """
        Delete record by id

        cls: class
        row_id: record id
        return: int (1 if deleted else 0)
        """
        obj = db.session.query(cls).filter(cls.id == row_id).delete()
        db.session.commit()
        return obj

    @classmethod
    def add_relation(cls, row_id, rel_obj):
        """
        Add relation to object

        cls: class
        row_id: record id
        rel_obj: related object
        """
        # todo: change cls names to actual
        obj = cls.query.filter_by(id=row_id).first()
        if cls.__name__ == "Actor":
            obj.filmography.append(rel_obj)
        elif cls.__name__ == "Movie":
            obj.cast.append(rel_obj)
        return commit(obj)

    @classmethod
    def remove_relation(cls, row_id, rel_obj):
        """
        Remove certain relation

        cls: class
        row_id: record id
        rel_obj: related object
        """
        obj = cls.query.get(row_id)
        db.session.delete(rel_obj)
        return commit(obj)

    @classmethod
    def clear_relations(cls, row_id):
        """
        Remove all relations by id

        cls: class
        row_id: record id
        """
        # todo: change cls names to actual
        obj = cls.query.get(row_id)
        if cls.__name__ == "Actor":
            obj.filmography = []
        elif cls.__name__ == "Movie":
            obj.cast = []

        return commit(obj)