class BlogsController < ApplicationController
  def index
      if session[:user_id] != nil # the client is logged in
      @user = User.find(session[:user_id])
      # same as the one below just more abstract
      # @user.itineraries
      @blogs = Blog.where({user_id: @user.id})

      # render text: "Hello, I know who you are: #{user.email}"
      render :index

      

    else
      #render text: 'Woah', status: 401
      redirect_to '/'
    end
  end
 
  def new 
    @blogs = Blog.new 
    render :index 
  end

  def create
    @blogs= Blog.new
    @blogs.search =  params[:search]
    @blogs.caption = params[:caption]
    @blogs.user_id = session[:user_id]

    if @blogs.save 
      redirect_to '/blogs'
    end
  end



 end


