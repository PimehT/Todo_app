#!/usr/bin/env python3
from models import storage
from models.user import User
from models.task import Task
from sqlalchemy import or_, and_, select, text

session = storage._DBStorage__session

# results = session.query(Task).filter(
#     or_(
#         Task.title.ilike(f'%%')
#     )
# ).all()

fields = {
    'title': 'test',
    'status': 'Pending'
}
# clauses = []
# for col in Task.__table__.columns:
#     col_name = str(col).split('.')[1]
#     col_query_value = fields.get(col_name, None)
#     if col_query_value:
#         clauses.append(col.ilike(f"%{col_query_value}%"))


# print(session.query(Task).filter(or_(*clauses)).all())

# print([r.title for r in results])
# for col in Task.__table__.columns:
#     print(col)

# col = [c for c in Task.__table__.columns][0]

# print(dir(col))
# results = session.query(Task).filter(Task.title == 'test*').all()

# print(results)

print(Task.__tablename__)
