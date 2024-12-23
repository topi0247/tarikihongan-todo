package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.55

import (
	"context"
	"strconv"
	"tarikihongan-todo/db"
	"tarikihongan-todo/internal/auth"
	"tarikihongan-todo/models"

	"github.com/volatiletech/sqlboiler/queries"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

// User is the resolver for the user field.
func (r *doneTodoResolver) User(ctx context.Context, obj *models.DoneTodo) (*models.User, error) {
	return obj.User().One(ctx, db.DB)
}

// Todo is the resolver for the todo field.
func (r *doneTodoResolver) Todo(ctx context.Context, obj *models.DoneTodo) (*models.Todo, error) {
	return obj.Todo().One(ctx, db.DB)
}

// DoneAt is the resolver for the done_at field.
func (r *doneTodoResolver) DoneAt(ctx context.Context, obj *models.DoneTodo) (string, error) {
	return obj.CreatedAt.Time.Format("2024/12/12 13:13"), nil
}

// CreateDoneTodoUser is the resolver for the CreateDoneTodoUser field.
func (r *mutationResolver) CreateDoneTodoUser(ctx context.Context, todoID string) (*models.Response, error) {
	todoIntId, err := strconv.Atoi(todoID)
	if err != nil {
		errMsg := err.Error()
		return &models.Response{Success: false, Message: &errMsg}, err
	}
	qm := models.TodoWhere.ID.EQ(todoIntId)
	todo, err := models.Todos(qm).One(ctx, db.DB)
	if err != nil {
		errMsg := err.Error()
		return &models.Response{Success: false, Message: &errMsg}, err
	}

	doneTodoUser := models.DoneTodo{
		UserID: auth.CurrentUser.ID,
		TodoID: todo.ID,
	}
	if err := doneTodoUser.Insert(ctx, db.DB, boil.Infer()); err != nil {
		errMsg := err.Error()
		return &models.Response{Success: false, Message: &errMsg}, err
	}

	successMsg := "Todo done successfully."
	return &models.Response{Success: true, Message: &successMsg}, nil
}

// DeleteDoneTodoUser is the resolver for the DeleteDoneTodoUser field.
func (r *mutationResolver) DeleteDoneTodoUser(ctx context.Context, todoID string) (*models.Response, error) {
	todoIntId, err := strconv.Atoi(todoID)
	if err != nil {
		errMsg := err.Error()
		return &models.Response{Success: false, Message: &errMsg}, err
	}
	qm := models.TodoWhere.ID.EQ(todoIntId)
	todo, err := models.Todos(qm).One(ctx, db.DB)
	if err != nil {
		errMsg := err.Error()
		return &models.Response{Success: false, Message: &errMsg}, err
	}

	_, err = queries.Raw("delete from done_todos where user_id = $1 and todo_id = $2", auth.CurrentUser.ID, todo.ID).Exec(db.DB)
	if err != nil {
		errMsg := err.Error()
		return &models.Response{Success: false, Message: &errMsg}, err
	}

	successMsg := "Todo undone successfully."
	return &models.Response{Success: true, Message: &successMsg}, nil
}

// DoneTodoByUser is the resolver for the DoneTodoByUser field.
func (r *queryResolver) DoneTodoByUser(ctx context.Context, userID *string) ([]*models.DoneTodo, error) {
	indId, err := strconv.Atoi(*userID)
	if err != nil {
		return nil, err
	}
	qm := models.DoneTodoWhere.UserID.EQ(indId)
	doneTodos, err := models.DoneTodos(qm).All(ctx, db.DB)
	if err != nil {
		return nil, err
	}
	return doneTodos, nil
}

// DoneTodoByTodo is the resolver for the DoneTodoByTodo field.
func (r *queryResolver) DoneTodoByTodo(ctx context.Context, todoID *string) ([]*models.DoneTodo, error) {
	indId, err := strconv.Atoi(*todoID)
	if err != nil {
		return nil, err
	}
	qm := models.DoneTodoWhere.TodoID.EQ(indId)
	doneTodos, err := models.DoneTodos(qm).All(ctx, db.DB)
	if err != nil {
		return nil, err
	}
	return doneTodos, nil
}

// DoneTodo returns db.DoneTodoResolver implementation.
func (r *Resolver) DoneTodo() db.DoneTodoResolver { return &doneTodoResolver{r} }

// Mutation returns db.MutationResolver implementation.
func (r *Resolver) Mutation() db.MutationResolver { return &mutationResolver{r} }

// Query returns db.QueryResolver implementation.
func (r *Resolver) Query() db.QueryResolver { return &queryResolver{r} }

type doneTodoResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
