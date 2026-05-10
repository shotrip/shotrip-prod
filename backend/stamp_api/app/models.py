from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import BigInteger, String, Text, Boolean, Integer, DateTime, Numeric, ForeignKey, UniqueConstraint, Enum
from decimal import Decimal
from datetime import datetime, timezone
import enum

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    user_id: Mapped[str] = mapped_column(String, primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


class Route(Base):
    __tablename__ = "routes"

    route_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    region: Mapped[str] = mapped_column(String, nullable=False)
    s3_key: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


class RouteCheckPoint(Base):
    __tablename__ = "route_checkpoints"
    __table_args__ = (
        UniqueConstraint("route_id", "order_no", name="unique_route_order"),
    )

    checkpoint_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    route_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("routes.route_id"), nullable=False, index=True)
    order_no: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    s3_key: Mapped[str] = mapped_column(String, nullable=False)
    stamp_s3_key: Mapped[str] = mapped_column(String, nullable=False)
    lat: Mapped[Decimal] = mapped_column(Numeric(10, 8), nullable=False)
    lng: Mapped[Decimal] = mapped_column(Numeric(11, 8), nullable=False)
    is_goal: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


class RouteStatus(enum.Enum):
    NOT_STARTED = "not-started"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
class UserStampRoute(Base):
    __tablename__ = "user_stamp_routes"

    user_route_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.user_id"), nullable=False, index=True)
    route_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("routes.route_id"), nullable=False, index=True)
    status: Mapped[RouteStatus] = mapped_column(Enum(RouteStatus, values_callable=lambda x: [e.value for e in x], name="route_status_enum", create_type=False), nullable=False, default=RouteStatus.NOT_STARTED)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


class UserCheckPoint(Base):
    __tablename__ = "user_checkpoints"
    __table_args__ = (
        UniqueConstraint('user_route_id', 'checkpoint_id', name='unique_user_checkpoint'),
    )

    user_checkpoint_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_route_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("user_stamp_routes.user_route_id"), nullable=False, index=True)
    checkpoint_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("route_checkpoints.checkpoint_id"), nullable=False, index=True)
    checked_in_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


class RouteReward(Base):
    __tablename__ = "route_rewards"

    reward_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    route_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("routes.route_id"), unique=True, nullable=False)
    affiliate_url: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)