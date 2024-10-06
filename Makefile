# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/05/23 12:50:22 by jfazi             #+#    #+#              #
#    Updated: 2024/09/05 15:39:04 by fpalumbo         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = webserv
CC = c++
CFLAGS = -Wall -Wextra -Werror  -std=c++98 -g3 #-fsanitize=address,undefined
SRCS = main.cpp \
	Parsconfig.cpp \
	Server.cpp \
	Request.cpp \
	Response.cpp \
	utils.cpp \
	CGI.cpp \
	
OBJS = $(SRCS:.cpp=.o)

all : $(NAME)
$(NAME) :
	$(CC) $(CFLAGS) -c $(SRCS)
	$(CC) $(CFLAGS) $(OBJS) -o $(NAME)
re : fclean all
clean :
	rm -f $(OBJS)
fclean : clean
	rm -f $(NAME)
.PHONY:	all clean fclean re