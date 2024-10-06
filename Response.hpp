/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Response.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/18 16:27:50 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/05 15:29:37 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once
#include "webserv.h"
#include "Parsconfig.hpp"

class Response
{
    private:
        string          httpVersion;
        string          languages;
        string			contentLength;
        string          contentType;
        string			content;
        string          statusCode;
        string          filePath;

        Parsconfig      config;
        SOCKET          sock;
    public:
        Response(string statusCode, SOCKET sock, Parsconfig config, string content);
        Response(string statusCode, string filePath, SOCKET sock, Parsconfig config);
        ~Response();

		void setContent();
		void setContentType();
		void setContentLength();
		void setAutoIndex();

        void SendFile(const char *filePath);

		void send();
};
