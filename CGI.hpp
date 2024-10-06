/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CGI.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jfazi <jfazi@student.42nice.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/04 15:42:01 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/06 13:27:35 by jfazi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "webserv.h"
#include "Parsconfig.hpp"
#include "Response.hpp"

class CGI
{
private:
    map<string, string> env;

public:
    CGI();
    ~CGI();
    void launchCgi(string filePath, SOCKET sock, Parsconfig config);
};