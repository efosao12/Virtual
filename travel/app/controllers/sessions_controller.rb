class SessionsController < ApplicationController
  
  def new
    
    render :new
  
  end

  def create
    
    user = User.find_by(email: params[:email])
    
    if user && user.authenticate(params[:password])

      session[:user_id] = user.id  
      # edit to users individual page when logged on. change this placeholder later
      redirect_to '/blogs'

    else 

      @message ="This email and password combination does not exist."
      render :new
    end
  
  end

  def destroy
  #create log out button
    session[:user_id] = nil 

    redirect_to new_sessions_path

  end
end
