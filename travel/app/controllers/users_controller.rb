class UsersController < ApplicationController
  def new
    @user = User.new
    render :new
  end
  

  def create
    @user = User.new
    @user.name = params[:name]
    @user.email = params[:email]
    @user.password = params[:password]
    @user.password_confirmation = params[:password_confirmation]

  if params[:password] == params[:password_confirmation]
      flash.now[:alert] = "Passwords must match!"
  end


    if @user.save 
       
       redirect_to "/"#come and modify when itineraries are made
    else
      render :new
    end
  end  
end
