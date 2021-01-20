from core import db
from datetime import date


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
    def update(cls, param: [int, dict], **kwargs):
        """
        Update record by id

        cls: class
        param: record para
        kwargs: dict with object parameters
        """
        obj = cls.query.get(param)

        for key, value in kwargs.items():
            setattr(obj, key, value)

        return commit(obj)

    @classmethod
    def delete(cls, param: [int, dict]):
        """
        Delete record by id

        cls: class
        param: record param
        return: bool (True if deleted else False)
        """
        obj = cls.query.get(param)

        if obj is None:
            return False

        db.session.delete(obj)
        db.session.commit()
        return True