from . import db


def commit(obj):
    """Function for convenient commit."""
    db.session.add(obj)
    db.session.commit()
    db.session.refresh(obj)

    return obj


class BaseModel:
    """Implement for interacting with the DataBase."""

    @classmethod
    def create(cls, **kwargs):
        """
        Create new record.

        Args:
            **kwargs: Record parameters.

        Returns:
            Class instance with created parameters.
        """
        obj = cls(**kwargs)
        return commit(obj)

    @classmethod
    def update(cls, param, **kwargs):
        """
        Update record data by record parameters.

        Args:
            param (int, dict): Record parameters for search.
            **kwargs: object parameters.

        Returns:
            Class instance with new parameters.
        """
        obj = cls.query.get(param)

        for key, value in kwargs.items():
            setattr(obj, key, value)

        return commit(obj)

    @classmethod
    def delete(cls, param):
        """
        Delete record from DB by record parameters.

        Args:
            param (int, dict): Record parameters for search.

        Returns:
            bool: True if succesful, False otherwise.
        """
        obj = cls.query.get(param)

        if obj is None:
            return False

        db.session.delete(obj)
        db.session.commit()
        return True
